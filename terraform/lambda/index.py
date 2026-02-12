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
        "Access-Control-Allow-Origin": "*"
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

        # Bezpieczne dekodowanie body
        if is_base64 and body:
            try:
                body_bytes = base64.b64decode(body)
            except Exception as e:
                print("DEBUG: base64 decode error:", str(e))
                body_bytes = b""
        else:
            body_bytes = body.encode('utf-8', errors='ignore')

        # Multipart
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
                        print("DEBUG: Attachment:", filename, "size:", len(attachment['content']))

        # JSON fallback
        else:
            print("DEBUG: JSON detected")

            if body:
                data = json.loads(body)
                name = data.get('name', name)
                email = data.get('email', email)
                subject = data.get('subject', subject)
                message = data.get('message', message)

        # Email MIME
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
