import json
import boto3
from botocore.exceptions import ClientError
import os

ses_client = boto3.client('ses', region_name='eu-central-1')

print("DEBUG: TO_EMAIL from env:", os.environ.get('TO_EMAIL'))
print("DEBUG: FROM_EMAIL from env:", os.environ.get('FROM_EMAIL'))

TO_EMAIL = os.environ['TO_EMAIL']
FROM_EMAIL = os.environ['FROM_EMAIL']

print("DEBUG: TO_EMAIL used:", TO_EMAIL)
print("DEBUG: FROM_EMAIL used:", FROM_EMAIL)

def handler(event, context):
    print("DEBUG: Handler started")
    print("DEBUG: Event body:", event.get('body'))

    try:
        body = json.loads(event['body'])

        name = body.get('name', 'Anonim')
        email = body.get('email', 'brak emaila')
        subject = body.get('subject', 'Wiadomość z formularza')
        message = body.get('message', 'Brak treści')

        email_body = f"""
Od: {name} <{email}>
Temat: {subject}

Wiadomość:
{message}
        """

        print("DEBUG: Sending email from:", FROM_EMAIL)
        print("DEBUG: To:", TO_EMAIL)

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