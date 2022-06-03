require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;
const axios = require('axios');

export const pinJSONToIPFS = async(JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, JSONBody, {
        headers: {
            pinata_api_key: key,
            pinata_secret_api_key: secret,
        }
    })
    .then(function (response) {
        return {
            success: true,
            pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
    })
    .catch(function (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        }
        
    });
};

// const pinataSDK = require("@pinata/sdk");
// require('dotenv').config();


// const pinata = pinataSDK(
//   process.env.PINATA_API_KEY,
//   process.env.PINATA_SECRET_API_KEY
// );

// export const pinFileToIPFS = async (fileName, address, name, symbol) => {
//   console.log(fs);
//   const uploadPath = '/'
//   const options = {
//     pinataMetadata: {
//       name: name,
//       keyvalues: {
//         address: address,
//         symbol: symbol,
//       },
//     },
//     pinataOptions: {
//       cidVersion: 0,
//     },
//   };
//   const readableStreamForFile = fs.createReadStream(uploadPath + fileName);
//   try {
//     let result = await pinata.pinFileToIPFS(readableStreamForFile, options);
//     return result;
//   } catch (error) {
//     console.log(error);
//     return "failed to pin file to ipfs";
//   }
// };

// export const pinJsonToIPFS = async (jsonMetadata) => {
//   const options = {
//     pinataMetadata: {
//       name: jsonMetadata.name,
//       keyvalues: {
//         address: jsonMetadata.properties.address,
//       },
//     },
//     pinataOptions: {
//       cidVersion: 0,
//     },
//   };
//   try {
//     let result = await pinata.pinJSONToIPFS(jsonMetadata, options);
//     return result;
//   } catch (error) {
//     console.log(error);
//     return "failed to pin json to ipfs";
//   }
// };


// export const testPinata = async () => {
//     const testJson = {
//         name: 'Pinata',
//         properties: {
//             address: 'address'
//         }
//     }
//     const res = await pinJsonToIPFS(testJson)
// }

// testPinata();

