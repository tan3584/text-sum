import * as mimeTypes from 'mime-types';
export const getExtension = async (
  file: Express.Multer.File,
): Promise<string> => {
  let extension = null;
  if (!mimeTypes.extension(file.mimetype)) {
    extension = file.originalname.substr(
      file.originalname.lastIndexOf('.') + 1,
    );
  } else {
    extension = mimeTypes.extension(file.mimetype);
  }
  return extension;
};
