import json
import boto3
from botocore.exceptions import ClientError
import os
from email.parser import BytesParser
from email.policy import default

ses_client = boto3.client('ses', region_name='eu-central-1')

TO_EMAIL = os.environ['TO_EMAIL']
FROM_EMAIL = os.environ['FROM_EMAIL']

def handler(event, context):
    print("DEBUG: Handler started")
    print("DEBUG: Event keys:", list(event.keys()))
    print("DEBUG: Headers:", event.get('headers', {}))
    print("DEBUG: Body type:", type(event.get('body')))

    try:
        content_type = event['headers'].get('content-type', '') or event['headers'].get('Content-Type', '')
        body = event['body']

        name = 'Anonim'
        email = 'brak emaila'
        subject = 'Wiadomość z formularza'
        message = 'Brak treści'
        attachment = None

        if 'multipart/form-data' in content_type.lower():
            print("DEBUG: Multipart detected")
            if 'boundary=' not in content_type:
                raise ValueError("Brak boundary w multipart")

            boundary = content_type.split("boundary=")[1].strip()
            print("DEBUG: Boundary:", boundary)

            # Parsowanie multipart
            msg_bytes = body.encode('utf-8') if isinstance(body, str) else body
            msg = BytesParser(policy=default).parsebytes(msg_bytes)

            # Pobieranie pól tekstowych
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
                        print("DEBUG: Załącznik znaleziony:", filename)

        else:
            print("DEBUG: JSON detected")
            body_dict = json.loads(body)
            name = body_dict.get('name', 'Anonim')
            email = body_dict.get('email', 'brak emaila')
            subject = body_dict.get('subject', 'Wiadomość z formularza')
            message = body_dict.get('message', 'Brak treści')
            attachment = None

        # Budujemy treść maila
        email_body = f"""
Od: {name} <{email}>
Temat: {subject}

Wiadomość:
{message}
        """

        if attachment:
            email_body += f"\n\nZałącznik: {attachment['filename']} (rozmiar: {len(attachment['content'])} bajtów)"

        print("DEBUG: Sending email from:", FROM_EMAIL)
        print("DEBUG: To:", TO_EMAIL)
        print("DEBUG: Subject:", subject)

        response = ses_client.send_email(
            Source=FROM_EMAIL,
            Destination={'ToAddresses': [TO_EMAIL]},
            Message={
                'Subject': {'Data': subject},
                'Body': {'Text': {'Data': email_body}}
            }
        )

        print("DEBUG: Email sent, MessageId:", response['MessageId'])

        return {
            'statusCode': 200,
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