const useUploadFile = (callback) => {

//   return async () => {
//       if (!files?.length) {
//         console.error('select a file');

//         return;
//       }

//       const file = files[0];
//       const buffer = await file.arrayBuffer();
//       const bytes = new Uint8Array(buffer);

//       try {
//         const promise = axios.post('/api/verify-image', {
//           address: account,
//           signature: await getSignedData(ethereum, account),
//           bytes,
//           contentType: file.type,
//           fileName: file.name.replace(/\.[^/.]+$/, ''),
//         });

//         const res = await toast.promise(promise, {
//           pending: 'Uploading image',
//           success: 'Image uploaded',
//           error: 'Image upload error',
//         });

//         callback?.(getPinataLink(res.data));
//       } catch (e) {
//         console.error(e);
//       }
//   }
}

export default useUploadFile;
