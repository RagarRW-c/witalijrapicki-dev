import json
import boto3
from botocore.exceptions import ClientError
import os
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

ses_client = boto3.client('ses', region_name='eu-central-1')

TO_EMAIL = os.environ['TO_EMAIL']
FROM_EMAIL = os.environ['FROM_EMAIL']


def cors_headers():
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }


def handler(event, context):
    print("DEBUG: Handler started")
    print("DEBUG: Event keys:", list(event.keys()))
    print("DEBUG: isBase64Encoded:", event.get('isBase64Encoded'))

    try:
        headers = event.get('headers', {}) or {}
        content_type = headers.get('content-type', '') or headers.get('Content-Type', '')

        name = 'Anonim'
        email = 'brak@emaila'
        subject = 'Wiadomość z formularza'
        message = 'Brak treści'
        attachment = None

        body = event.get('body') or ""
        is_base64 = event.get('isBase64Encoded', False)

        # Dekodowanie body – obsługa Binary Media Types
        if is_base64:
            print("DEBUG: Body jest base64 – dekoduję")
            try:
                body_bytes = base64.b64decode(body)
                print(f"DEBUG: Długość po dekodowaniu: {len(body_bytes)} bajtów")
            except Exception as e:
                print(f"DEBUG: Błąd dekodowania base64: {str(e)}")
                return {
                    'statusCode': 400,
                    'headers': cors_headers(),
                    'body': json.dumps({'error': 'Błąd dekodowania pliku'})
                }
        else:
            # Bez binary – body jako string, konwertujemy bezstratnie
            print("DEBUG: Body nie jest base64 – konwertuję string na bajty")
            try:
                body_bytes = body.encode('latin-1')  # latin-1 zachowuje bajty 0-255
                print(f"DEBUG: Długość po konwersji: {len(body_bytes)} bajtów")
            except Exception as e:
                print(f"DEBUG: Błąd konwersji body: {str(e)}")
                return {
                    'statusCode': 400,
                    'headers': cors_headers(),
                    'body': json.dumps({'error': 'Nieprawidłowy format danych'})
                }

        # Preview body do logów
        body_preview = body_bytes[:400].decode('latin-1', errors='replace')
        print(f"DEBUG: Content-Type: {content_type}")
        print(f"DEBUG: Body preview:\n{body_preview}\n")

        # Parsowanie multipart
        if 'multipart/form-data' in content_type.lower():
            print("DEBUG: Multipart detected")
            from email.parser import BytesParser
            from email.policy import default

            try:
                msg = BytesParser(policy=default).parsebytes(body_bytes)
                print(f"DEBUG: Parsowanie udane. is_multipart: {msg.is_multipart()}")

                for part in msg.walk():
                    if part.get_content_maintype() == 'multipart':
                        continue
                    if part.get('Content-Disposition') is None:
                        continue

                    field_name = part.get_param('name', header='content-disposition')
                    print(f"DEBUG: Znaleziono pole: {field_name}")

                    if field_name == 'name':
                        name = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                    elif field_name == 'email':
                        email = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                    elif field_name == 'subject':
                        subject = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                    elif field_name == 'message':
                        message = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                    elif field_name == 'attachment':
                        filename = part.get_filename()
                        if filename:
                            content = part.get_payload(decode=True)
                            content_type_part = part.get_content_type()
                            size = len(content) if content else 0
                            print(f"DEBUG: Załącznik: {filename}, typ: {content_type_part}, rozmiar: {size} bajtów")
                            if size > 0:
                                attachment = {
                                    'filename': filename,
                                    'content_type': content_type_part,
                                    'content': content
                                }
                            else:
                                print("DEBUG: Załącznik pusty")

            except Exception as e:
                print(f"DEBUG: Błąd parsowania multipart: {str(e)}")
                return {
                    'statusCode': 500,
                    'headers': cors_headers(),
                    'body': json.dumps({'error': 'Błąd przetwarzania formularza'})
                }

        # JSON fallback
        else:
            print("DEBUG: JSON detected")
            if body:
                try:
                    data = json.loads(body)
                    name = data.get('name', name)
                    email = data.get('email', email)
                    subject = data.get('subject', subject)
                    message = data.get('message', message)
                except Exception as e:
                    print(f"DEBUG: Błąd JSON: {str(e)}")

        # Budowanie MIME
        mime_msg = MIMEMultipart()
        mime_msg['Subject'] = subject
        mime_msg['From'] = FROM_EMAIL
        mime_msg['To'] = TO_EMAIL
        mime_msg['Reply-To'] = email

        mime_msg.attach(MIMEText(f"""
Od: {name} <{email}>

Wiadomość:
{message}
        """, 'plain', 'utf-8'))

        if attachment:
            print("DEBUG: Dołączanie załącznika")
            part = MIMEApplication(
                attachment['content'],
                _subtype=attachment['content_type'].split('/')[-1] or 'octet-stream'
            )
            part.add_header('Content-Disposition', 'attachment', filename=attachment['filename'])
            mime_msg.attach(part)

        raw_message = mime_msg.as_bytes()

        response = ses_client.send_raw_email(
            Source=FROM_EMAIL,
            Destinations=[TO_EMAIL],
            RawMessage={'Data': raw_message}
        )

        print("DEBUG: Email sent:", response['MessageId'])

        return {
            'statusCode': 200,
            'headers': cors_headers(),
            'body': json.dumps({'message': 'Wiadomość wysłana!'})
        }

    except ClientError as e:
        print("DEBUG: SES ClientError:", str(e))

        return {
            'statusCode': 500,
            'headers': cors_headers(),
            'body': json.dumps({'error': str(e)})
        }

    except Exception as e:
        print("DEBUG: General error:", str(e))

        return {
            'statusCode': 500,
            'headers': cors_headers(),
            'body': json.dumps({'error': 'Błąd serwera'})
        }