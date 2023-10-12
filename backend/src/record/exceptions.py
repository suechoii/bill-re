from fastapi import HTTPException, status

class CreateNewRecordFail(HTTPException):
    def __init__(self):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = "Failed to create a new record. Try again."