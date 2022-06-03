import Axios from "axios";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useWallet } from "@binance-chain/bsc-use-wallet";

import { uploadFile } from "utils/ipfs";
import "./style.scss";
import Blockies from "react-blockies";

const ProfileEdit = (props) => {
  const history = useHistory();
  const { account } = useWallet();
  const authState = useSelector((state) => state.auth);
  const { signature, user } = authState;
  const [name, setName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [biography, setBiography] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);

  const fileInput = React.createRef();
  const coverInput = React.createRef();

  const onAvatarInput = async () => {
    fileInput.current.click();
  };

  const handleSubmit = async () => {
    if (account && name && !avatarError && !coverError) {
      const { data } = await Axios.post(
        `${process.env.REACT_APP_API}/user`,
        {
          address: String(account).toLowerCase(),
          avatar,
          name,
          coverImage,
          twitter,
          instagram,
          biography,
        },
        {
          headers: {
            signature,
          },
        }
      );

      setName(data.user?.name);
      setAvatar(data.user?.avatar);
      setCoverImage(data.user?.coverImage);
      setTwitter(data.user?.twitter);
      setInstagram(data.user?.instagram);
      setBiography(data.user?.biography);
    }
  };

  const handleAvatarUpload = async () => {
    if (fileInput.current.files.length > 0) {
      setAvatarError(false);
      const size = fileInput.current.files[0].size;
      if (size / 1024.0 / 1024.0 > 5) {
        setAvatarError(true);
      } else {
        setIsAvatarUploading(true);
        try {
          const res = await uploadFile({ file: fileInput.current.files[0] });
          setAvatar(res);
          setIsAvatarUploading(false);
        } catch (err) {
          console.log(err);
          setIsAvatarUploading(false);
        }
      }
    }
  };

  const handleCoverUpload = async () => {
    if (coverInput.current.files.length > 0) {
      setCoverError(false);
      const size = coverInput.current.files[0].size;
      if (size / 1024.0 / 1024.0 > 5) {
        setCoverError(true);
      } else {
        setIsCoverUploading(true);
        try {
          const res = await uploadFile({ file: coverInput.current.files[0] });
          setCoverImage(res);
          setIsCoverUploading(false);
        } catch (err) {
          console.log(err);
          setIsCoverUploading(false);
        }
      }
    }
  };

  useEffect(() => {
    setName(user?.name);
    setAvatar(user?.avatar);
    setCoverImage(user?.coverImage);
    setTwitter(user?.twitter);
    setInstagram(user?.instagram);
    setBiography(user?.biography);
  }, [account, signature]);

  useEffect(() => {
    if (!account) {
      history.push("/");
    }
  }, [account]);

  return (
    <div className="profile-edit-page">
      <div className="grey-background">
        {coverImage && <img src={coverImage} alt="" />}
        <input
          type="file"
          ref={coverInput}
          className="file-input"
          accept=".PNG, .JPEG"
          onChange={handleCoverUpload}
          hidden
        />
        <button
          className="upload-cover-btn"
          onClick={() => coverInput.current.click()}
        >
          Upload cover
        </button>
      </div>
      <div className="page-content">
        <div className="profile-picture-wrapper">
          {
            avatar?<img
            className="profile-picture"
            src={avatar}
            alt={"Avatar"}
          />:
            <Blockies
                seed={account ? account : ""}
                size={24}
                scale={6}
                className="profile-picture"
              />
          }
        </div>

        <h2 className="page-title">Edit profile</h2>

        <div className="profile-form-control">
          <span className="profile-form-label">Profile Picture</span>
          <input
            type="file"
            ref={fileInput}
            className="file-input"
            accept=".PNG, .JPEG"
            onChange={handleAvatarUpload}
          />
          <button
            className="profile-form-btn picture-btn"
            onClick={onAvatarInput}
          >
            Choose file
          </button>
          <span
            className={`profile-form-description ${avatarError ? "error" : ""}`}
          >
            PNG, JPG - Max 5 MB
          </span>
        </div>

        <div className="profile-form-control">
          <span className="profile-form-label">Profile name</span>
          <div className="input-wrapper">
            <input
              className="profile-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              maxLength={20}
            />
          </div>
          <span className="profile-form-description">Max 20 characters</span>
        </div>

        <div className="profile-form-control">
          <span className="profile-form-label">Twitter</span>
          <div className="input-wrapper">
            <span className="profile-input-label">twitter.com/</span>
            <input
              className="profile-input"
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>
          <span className="profile-form-description">Your twitter handle</span>
        </div>

        <div className="profile-form-control">
          <span className="profile-form-label">Instagram</span>
          <div className="input-wrapper">
            <span className="profile-input-label">instagram.com/</span>
            <input
              className="profile-input"
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
          <span className="profile-form-description">
            Your instagram handle
          </span>
        </div>

        <div className="profile-form-control">
          <span className="profile-form-label">Biography</span>
          <div className="input-wrapper">
            <textarea
              className="profile-input profile-textarea"
              placeholder="Write a description for your profile"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
            />
          </div>
        </div>

        <div className="profile-form-control">
          <button
            className="profile-form-btn save-btn"
            onClick={handleSubmit}
            disabled={
              !account ||
              avatarError ||
              coverError ||
              isAvatarUploading ||
              isCoverUploading
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProfileEdit);
