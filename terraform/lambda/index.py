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

def handler(event, context):
    print("DEBUG: Handler started")
    print("DEBUG: Event keys:", list(event.keys()))
    print("DEBUG: isBase64Encoded:", event.get('isBase64Encoded'))

    try:
        headers = event.get('headers', {})
        content_type = headers.get('content-type', '') or headers.get('Content-Type', '')

        name = 'Anonim'
        email = 'brak@emaila'
        subject = 'Wiadomość z formularza'
        message = 'Brak treści'
        attachment = None

        # Odczytujemy body
        body = event.get('body')
        is_base64 = event.get('isBase64Encoded', False)

        if is_base64:
            body_bytes = base64.b64decode(body)
        else:
            body_bytes = body if isinstance(body, bytes) else body.encode('utf-8', errors='ignore')

        # Parsowanie multipart/form-data
        if 'multipart/form-data' in content_type.lower():
            print("DEBUG: Multipart detected")
            from email.parser import BytesParser
            from email.policy import default
            msg = BytesParser(policy=default).parsebytes(body_bytes)

            for part in msg.walk():
                if part.get_content_maintype() == 'multipart':
                    continue
                if part.get('Content-Disposition') is None:
                    continue

                field_name = part.get_param('name', header='content-disposition')
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
                        attachment = {
                            'filename': filename,
                            'content_type': part.get_content_type(),
                            'content': part.get_payload(decode=True)
                        }
                        print("DEBUG: Załącznik znaleziony:", filename, "rozmiar:", len(attachment['content']))

        else:
            print("DEBUG: JSON detected")
            body_str = body.decode('utf-8') if isinstance(body, bytes) else body
            data = json.loads(body_str)
            name = data.get('name', 'Anonim')
            email = data.get('email', 'brak emaila')
            subject = data.get('subject', 'Wiadomość z formularza')
            message = data.get('message', 'Brak treści')

        # Budujemy MIME wiadomość
        msg = MIMEMultipart()
        msg['Subject'] = subject
        msg['From'] = FROM_EMAIL
        msg['To'] = TO_EMAIL
        msg['Reply-To'] = email

        # Tekstowa część
        msg.attach(MIMEText(f"""
Od: {name} <{email}>
Temat: {subject}

Wiadomość:
{message}
        """, 'plain', 'utf-8'))

        # Załącznik
        if attachment:
            part = MIMEApplication(attachment['content'], _subtype=attachment['content_type'].split('/')[-1] or 'octet-stream')
            part.add_header('Content-Disposition', 'attachment', filename=attachment['filename'])
            msg.attach(part)

        raw_message = msg.as_bytes()

        response = ses_client.send_raw_email(
            Source=FROM_EMAIL,
            Destinations=[TO_EMAIL],
            RawMessage={'Data': raw_message}
        )

        print("DEBUG: Email sent, MessageId:", response['MessageId'])

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'message': 'Wiadomość wysłana!'})
        }

    except ClientError as e:
        print("DEBUG: SES ClientError:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    except Exception as e:
        print("DEBUG: General error:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Błąd serwera'})
        }