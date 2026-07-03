from fastapi import APIRouter


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/users/register")

@router.post("/users/login")

@router.post("/admins/register")

@router.post("/admins/login")