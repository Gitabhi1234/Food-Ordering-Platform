from fastapi import APIRouter, UploadFile, File, HTTPException

import cloudinary.uploader

import app.core.cloudinary

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/")
async def upload_image(
    image: UploadFile = File(...)
):

    try:

        result = cloudinary.uploader.upload(
            image.file
        )

        return {

            "imageUrl": result["secure_url"]

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )