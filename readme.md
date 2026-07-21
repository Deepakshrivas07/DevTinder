# Dependencies

# Devtinder APIs

## AuthRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile
- POST /profile/edit
- POST /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accept/:requestId
- POST /request/review/reject/:requestId

## userRouter
- GET user/connections
- GET user/request/
- GET /feed - Gets  you the profile of other users on platform

Status: ignore,interested,accept,reject
