from fastapi import HTTPException, status

class CreateNewRecordFail(HTTPException):
    def __init__(self):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = "Failed to create a new record. Try again."

class RecordNotFoundException(HTTPException):
    def __init__(self, id: int):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = f"Record {id} has not been found."