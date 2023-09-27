from fastapi import HTTPException, status

class FriendUsernameNotFoundException(HTTPException):
    def __init__(self, friend_username: str):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = f'The username {friend_username} does not exist or is non-searchable.'