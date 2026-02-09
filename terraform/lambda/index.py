import json
import boto3
import os
import base64
import io
import cgi

from botocore.exceptions import ClientError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.header import Header

# ===== KONFIGURACJA =====

ses_client = boto3.client("ses", region_name="eu-central-1")

TO_EMAIL = os.environ["TO_EMAIL"]
FROM_EMAIL = os.environ["FROM_EMAIL"]

MAX_ATTACHMENT_SIZE = 8 * 1024 * 1024  # 8 MB (bezpieczny limit)

# ===== HANDLER =====

def handler(event, context):
    try:
        headers = event.get("headers") or {}
        content_type = headers.get("content-type") or headers.get("Content-Type", "")

        name = "Anonim"
        email = "brak@emaila"
        subject = "Wiadomość z formularza"
        message = "Brak treści"
        attachment = None

        # =====================================================
        # MULTIPART / FORM-DATA
        # =====================================================
        if "multipart/form-data" in content_type.lower():

            if event.get("isBase64Encoded"):
                body_bytes = base64.b64decode(event["body"])
            else:
                body_bytes = event["body"].encode("utf-8")

            environ = {
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE": content_type,
                "CONTENT_LENGTH": str(len(body_bytes)),
            }

            form = cgi.FieldStorage(
                fp=io.BytesIO(body_bytes),
                environ=environ,
                keep_blank_values=True,
            )

            name = form.getvalue("name", name)
            email = form.getvalue("email", email)
            subject = form.getvalue("subject", subject)
            message = form.getvalue("message", message)

            if "attachment" in form:
                fileitem = form["attachment"]
                if fileitem.filename:
                    file_content = fileitem.file.read()

                    if len(file_content) > MAX_ATTACHMENT_SIZE:
                        raise ValueError("Załącznik przekracza limit rozmiaru")

                    attachment = {
                        "filename": fileitem.filename,
                        "content_type": fileitem.type or "application/octet-stream",
                        "content": file_content,
                    }

        # =====================================================
        # JSON BODY
        # =====================================================
        else:
            body = event.get("body", "{}")

            if event.get("isBase64Encoded"):
                body = base64.b64decode(body).decode("utf-8")

            data = json.loads(body)

            name = data.get("name", name)
            email = data.get("email", email)
            subject = data.get("subject", subject)
            message = data.get("message", message)

        # =====================================================
        # BUDOWA EMAILA
        # =====================================================
        msg = MIMEMultipart()
        msg["From"] = FROM_EMAIL
        msg["To"] = TO_EMAIL
        msg["Reply-To"] = email
        msg["Subject"] = Header(subject, "utf-8")

        body_text = f"""Od: {name} <{email}>

Wiadomość:
{message}
"""

        msg.attach(MIMEText(body_text, "plain", "utf-8"))

        if attachment:
            part = MIMEApplication(
                attachment["content"],
                _subtype=attachment["content_type"].split("/")[-1],
            )
            part.add_header(
                "Content-Disposition",
                "attachment",
                filename=attachment["filename"],
            )
            msg.attach(part)

        # =====================================================
        # SES SEND
        # =====================================================
        ses_client.send_raw_email(
            Source=FROM_EMAIL,
            Destinations=[TO_EMAIL],
            RawMessage={"Data": msg.as_bytes()},
        )

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": "Wiadomość wysłana"}),
        }

    except ClientError as e:
        print("SES error:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Błąd SES"}),
        }

    except Exception as e:
        print("Handler error:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Błąd serwera"}),
        }
