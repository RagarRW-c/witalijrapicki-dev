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

        # Decydujemy jak traktować body
        if is_base64 and body:
            print("DEBUG: Dekodowanie base64")
            try:
                body_bytes = base64.b64decode(body)
                print(f"DEBUG: body_bytes po dekodowaniu base64: {len(body_bytes)} bajtów")
            except Exception as e:
                print(f"DEBUG: Błąd dekodowania base64: {str(e)}")
                body_bytes = b""
        else:
            # API Gateway proxy integration → body jest już stringiem (nie base64)
            # Nie robimy .encode() – zostawiamy jako string i dopiero parserowi dajemy bajty
            print("DEBUG: Body przyszło jako string (bez base64)")
            print(f"DEBUG: Długość body jako string: {len(body)} znaków")
            # Konwertujemy dopiero tutaj na bajty – ale ostrożnie
            body_bytes = body.encode('latin-1')   # latin-1 zachowuje wszystkie bajty 0-255

        # Logujemy fragment body do diagnozy (bezpiecznie)
        body_preview = body[:400] if isinstance(body, str) else body_bytes[:400].decode('latin-1', errors='replace')
        print(f"DEBUG: Content-Type: {content_type}")
        print(f"DEBUG: Body preview (pierwsze 400 znaków/bajtów):\n{body_preview}\n")

        # Parsowanie multipart
        if 'multipart/form-data' in content_type.lower():
            print("DEBUG: Multipart detected – używamy BytesParser")

            from email.parser import BytesParser
            from email.policy import default

            try:
                msg = BytesParser(policy=default).parsebytes(body_bytes)
                print(f"DEBUG: Parser przeszedł pomyślnie. is_multipart: {msg.is_multipart()}")

                for part in msg.walk():
                    if part.get_content_maintype() == 'multipart':
                        continue

                    disposition = part.get('Content-Disposition')
                    if disposition is None:
                        continue

                    field_name = part.get_param('name', header='content-disposition')

                    if field_name in ('name', 'email', 'subject', 'message'):
                        value = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                        if field_name == 'name':
                            name = value
                        elif field_name == 'email':
                            email = value
                        elif field_name == 'subject':
                            subject = value
                        elif field_name == 'message':
                            message = value
                        print(f"DEBUG: Pole {field_name}: {value[:60]}...")

                    elif field_name == 'attachment':
                        filename = part.get_filename()
                        if filename:
                            content = part.get_payload(decode=True)
                            content_type_part = part.get_content_type() or 'application/octet-stream'
                            size = len(content) if content else 0
                            print(f"DEBUG: === ZAŁĄCZNIK WYKRYTY ===")
                            print(f"DEBUG:   Filename: {filename}")
                            print(f"DEBUG:   Content-Type: {content_type_part}")
                            print(f"DEBUG:   Rozmiar: {size} bajtów")
                            if size > 0:
                                attachment = {
                                    'filename': filename,
                                    'content_type': content_type_part,
                                    'content': content
                                }
                            else:
                                print("DEBUG: Załącznik znaleziony, ale zawartość jest pusta!")

                if not attachment:
                    print("DEBUG: Nie znaleziono załącznika (lub był pusty)")

            except Exception as parse_err:
                print(f"DEBUG: Błąd parsowania multipart: {str(parse_err)}")

        # JSON fallback (dla testów bez pliku)
        else:
            print("DEBUG: JSON fallback")
            if body:
                try:
                    data = json.loads(body)
                    name = data.get('name', name)
                    email = data.get('email', email)
                    subject = data.get('subject', subject)
                    message = data.get('message', message)
                except Exception as json_err:
                    print(f"DEBUG: Błąd parsowania JSON: {str(json_err)}")

        # Budowanie maila
        mime_msg = MIMEMultipart()
        mime_msg['Subject'] = subject
        mime_msg['From'] = FROM_EMAIL
        mime_msg['To'] = TO_EMAIL
        mime_msg['Reply-To'] = email

        body_text = f"""
Od: {name} <{email}>

Wiadomość:
{message}
        """.strip()

        mime_msg.attach(MIMEText(body_text, 'plain', 'utf-8'))

        if attachment and attachment['content']:
            print(f"DEBUG: Dołączanie załącznika: {attachment['filename']} ({len(attachment['content'])} bajtów)")
            part = MIMEApplication(
                attachment['content'],
                _subtype=attachment['content_type'].split('/')[-1] or 'octet-stream'
            )
            part.add_header('Content-Disposition', 'attachment', filename=attachment['filename'])
            mime_msg.attach(part)
        else:
            print("DEBUG: Brak załącznika do dołączenia")

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