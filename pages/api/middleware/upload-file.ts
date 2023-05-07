import { join } from 'path';
import formidable, { Fields, File } from 'formidable';
import { NextApiRequest } from 'next';

type UploadFileParams = {
  req: NextApiRequest;
  onSuccess: (field: Fields, file: File) => void;
  onError: (err: any) => void;
};

const uploadDir = join(process.cwd(), 'public/upload');
const uploader = formidable({
  maxFiles: 1,
  maxFileSize: 1024 * 1024, // 1mb
  uploadDir,
  filename: (_name, _ext, part) => {
    const { originalFilename } = part;
    const uniqueSuffix = Date.now();
    const filename = `${uniqueSuffix}_${originalFilename}`;
    return filename;
  },
  filter: (part) => {
    return part.name === 'media' && (part.mimetype?.includes('image') || false);
  },
});

export const uploadFile = ({ req, onSuccess, onError }: UploadFileParams) =>
  uploader.parse(req, (err, fields, files) => {
    if (err) {
      return onError(err);
    }
    const file = files.media[0];
    onSuccess(fields, file);
  });
