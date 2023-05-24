const mongoose = require('mongoose')
const stream = require("stream");
const path = require("path");
const { google } = require("googleapis");

const Logo = require('../models/logoModel')
const Color = require('../models/colorModel')

const KEYFILEPATH = path.join(__dirname, "../credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// FUNCTION

const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
      media: {
        mimeType: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: ["1IDgXOMzKpzernHqZmsSBYqU94NHRD8Q_"],
      },
      fields: "id,name",
    });

    console.log(`Uploaded file ${data.name} ${data.id}`);
    return data
};

const deleteFile = async (fileId) => {
    await google.drive({ version: "v3", auth }).files.delete({
      fileId: fileId,
    });
    console.log(`Deleted file ${fileId}`);
  };

const uploadLogo = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
      media: {
        mimeType: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: ["1IDgXOMzKpzernHqZmsSBYqU94NHRD8Q_"],
      },
      fields: "id,name",
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
};

const getLogoList = async () => {
    try {
        const data = await google.drive({ version: "v3", auth }).files.list({
            q: `'1IDgXOMzKpzernHqZmsSBYqU94NHRD8Q_' in parents and trashed = false`,
            fields: "files(id, name, mimeType)",
        })
    
        return data.data.files;
    } catch (error) {
        return error
    }
}

// FOR ROUTES

const getImageList = async (req, res) => {
    try {
        const data = await google.drive({ version: "v3", auth }).files.list({
            pageSize: 10,
            q: `'1IDgXOMzKpzernHqZmsSBYqU94NHRD8Q_' in parents and trashed = false`,
            fields: "nextPageToken, files(id, name, mimeType)",
        });

        res.status(200).json(data.data);
    } catch (error) {
        res.status(400).json({ error });
    }
};


const getImageListLoadMore = async (req, res) => {
    try {
        const { nextPageToken } = req.params;

        const data = await google.drive({ version: "v3", auth }).files.list({
            pageSize: 10,
            q: `'1IDgXOMzKpzernHqZmsSBYqU94NHRD8Q_' in parents and trashed = false`,
            fields: "nextPageToken, files(id, name, mimeType)",
            pageToken: nextPageToken
        });
        console.log(data.data.nextPageToken)
        res.status(200).json(data.data);
    } catch (error) {
        res.status(400).json({ error });
    }
};


const uploadImage = async (req, res) => {
    try {
        let newImgId = []
        const { body, files } = req;
        console.log('thisis files', req.files);

        for (let f = 0; f < files.length; f += 1) {
            // await uploadFile(files[f]);
            let container = await uploadFile(files[f]);
            newImgId.push({
                id: container.id,
                name: container.name,
                mimeType: container.mimeType
            })
            console.log(`this is container: ${container}`)
        }

        res.status(200).send(newImgId);
    } catch (f) {
        res.send(f.message);
    } 
}

const deleteImage = async (req, res) => {
    const { fileId } = req.params;
    await deleteFile(fileId);
    res.status(200).send("File deleted");
}

const getLogoDrive = async (req, res) => {
    try {
        const data = await getLogoList();

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error })
    }
}

const setLogo = async (req, res) => {
    try {
        const logoDrive = await getLogoList();
        if (logoDrive.length != 0)
            await deleteFile(logoDrive[0].id);

        const { body, files } = req;
        console.log(files)
        for (let f = 0; f < files.length; f += 1) {
            await uploadLogo(files[f]);
        }

        // const newLogoDrive = await getLogoList();
        // const logoModel = await Logo.create({
        //     imageId: newLogoDrive[0].id,
        //     imageName: newLogoDrive[0].name,
        //     googleDriveFolderId: "1IDgXOMzKpzernHqZmsSBYqU94NHRD8Q_",
        //     fileType: newLogoDrive[0].mimeType
        // })
        res.status(200).send("Logo Submitted");
    } catch (error) {
        res.send(error.message);
    }
}

const getColor = async (req, res) => {
    const color = await Color.find({}).sort({ createdAt: -1 }).limit(1); 
    res.status(200).json(color);
}

const updateColor = async (req, res) => {
    const { _id } = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)) {
        try {
            const color = await Color.create({
                navColor: req.body.navColor,
                bodyColor: req.body.bodyColor,
                googleDriveFolderId: req.body.googleDriveId
            })
            return res.status(200).json(color)
        }
        catch (error) {
            return res.status(400).json(error)
        }
    }

    const color = await Color.findOneAndUpdate({ _id: _id }, {
        ...req.body
    })

    if (!color) {
        return res.status(400).json({ error: 'No such color' })
    }

    res.status(200).json(color)
}

module.exports = {
    getImageList,
    getImageListLoadMore,
    uploadImage,
    deleteImage,
    getLogoDrive,
    setLogo,
    getColor,
    updateColor
}