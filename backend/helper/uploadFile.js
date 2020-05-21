const { Storage } = require("@google-cloud/storage");
exports.uploadImageToFirebase = (file) => {
  const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
  });

  //social-network-48b35.appspot.com

  //const bucket = storage.bucket("posts");
  //const file = bucket.file('my-existing-file.png');

  const bucket = storage.bucket(`${process.env.GCLOUD_STORAGE_BUCKET_URL}`);
  let publicUrl;

  try {
    const blob = bucket.file(`posts/${file.originalname}`);
    console.log("bucket__name__", bucket.name);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // If there's an error
    blobStream.on("error", (err) => console.log("err while uploading+ " + err));

    // If all is good and done
    blobStream.on("finish", () => {
      // Assemble the file public URL
      /* publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURI(blob.name)}?alt=media`; */
      //console.log("public url", publicUrl);
      // Return the file name and its public URL
      // for you to store in your own database
    });
    publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(blob.name)}?alt=media`;

    blobStream.end(file.buffer);
    return publicUrl;
    // When there is no more data to be consumed from the stream the end event gets emitted
  } catch (error) {
    return error;
  }
};
