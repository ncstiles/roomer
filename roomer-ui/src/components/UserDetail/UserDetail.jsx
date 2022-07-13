import * as React from "react";
import "./UserDetail.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BASE_API_URL } from "../../constants";
import NotFound from "../NotFound/NotFound";
import DetailCard from "../DetailCard/DetailCard";
import Loading from "../Loading/Loading";
import NotAuthorized from "../NotAuthorized/NotAuthorized";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function UserDetail({ isLoggedIn, username }) {
  let newUsername = '';
  // default for `username` state variable is '' (set in App.jsx)
  // `username` is only not empty string when being called by the Profile compnent
  if (username) {
    newUsername = username;
  } 
  // the usual way UserDetail is called is thru useNavigate, in this case update
  // username state variable using the params
  else {
    let {username} = useParams();
    newUsername = username;
  }
  let [basicInfo, setBasicInfo] = useState({});
  let [preferenceInfo, setPreferenceInfo] = useState({});
  let [housingInfo, setHousingInfo] = useState({});
  let [extraInfo, setExtraInfo] = useState({});
  let [isLoading, setIsLoading] = useState(true);

  let [success, setSuccess] = useState(true);
  let [slideIx, setSlideIx] = useState(0);
  let [activeDot, setActiveDot] = useState(1);
  let [cardType, setCardType] = useState("basic");
  let [labels, setLabels] = useState([]);
  let [allInfo, setAllInfo] = useState([]);
  let [contentType, setContentType] = useState(null);
  let [pfpSrc, setPfpSrc] = useState(null);

  /**
   * Execute a GET request to get an individual user's basic info.
   * Set the `basicInfo` state variable to the contents of the response.
   */
  const getAllUserInfo = async () => {
    return axios({
      method: "get",
      url: `${BASE_API_URL}/allInfo/${newUsername}`,
    })
      .then((res) => {
        const allInfo = res.data.allInfo
        const basicInfo = allInfo.basic;
        setContentType(basicInfo.contentType);
        setPfpSrc(basicInfo.pfpSrc);
        delete basicInfo.contentType;
        delete basicInfo.pfpSrc;
        setBasicInfo(basicInfo);
        setPreferenceInfo(allInfo.preferences);
        setHousingInfo(allInfo.housing);
        setExtraInfo(allInfo.extra);
      })
      .catch((e) => {
        setSuccess(false);
      });
  };

  /**
   * Only get individual's detailed info upon first render
   */
  useEffect(() => {
    setIsLoading(true);
    getAllUserInfo().then(() => {
      setIsLoading(false);
    });
  }, []);


  // for each card, upload the requisite data and labels, and set the correct "dot" indicator
  useEffect(() => {
    // only update `labels` and `allInfo` after we've received all our information
    if (!isLoading) {
      // to prevent slideshow looping/ OOB
      if (slideIx > 3) {
        setSlideIx(3);
      }
      // to prevent negative indices
      if (slideIx < 0) {
        setSlideIx(0);
      }

      if (slideIx === 0) {
        setActiveDot(1);
        setCardType("basic");
        setLabels(["Age", "Gender", "Occupation"]);
        setAllInfo([
          basicInfo.firstName,
          basicInfo.age,
          basicInfo.gender,
          basicInfo.occupation,
        ]);
      } else if (slideIx === 1) {
        setActiveDot(2);
        setCardType("housing");
        setLabels(["Rent/month", "Address", "Location"]);

        let generalLocation = `${housingInfo.city}, ${housingInfo.state}`;
        const locWithZip = housingInfo.zip
          ? `${generalLocation} ${housingInfo.zip}`
          : `${generalLocation}`;

        const address = housingInfo.addr
          ? housingInfo.addr
          : "Up to discussion";

        setAllInfo([
          "Housing Details",
          housingInfo.rentRange,
          address,
          locWithZip,
        ]);
      } else if (slideIx === 2) {
        setActiveDot(3);
        setCardType("preferences");

        const requiredLabels = [
          "Location radius",
          "Gender preference",
          "Age preference",
        ];

        const requiredInfo = [
          preferenceInfo.locRad,
          preferenceInfo.genderPref,
          preferenceInfo.agePref,
        ];

        if (preferenceInfo.profession) {
          setLabels(["Profession"].concat(requiredLabels));
          setAllInfo(
            ["Profession + preferences", preferenceInfo.profession].concat(
              requiredInfo
            )
          );
        } else {
          setLabels(requiredLabels);
          setAllInfo(["Profession + preferences"].concat(requiredInfo));
        }
      } else if (slideIx === 3) {
        setActiveDot(4);
        setCardType("extra");
        setLabels([]);
        setAllInfo(["Introduction", extraInfo.bio, extraInfo.insta]);
      }
    }
  }, [slideIx, isLoading]);

  return (
    <>
      {isLoggedIn ? (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {/* after all information is finished loading render the card */}
              {success && allInfo ? (
                <>
                  <div className="slideshow-container">
                    {/* back arrow */}
                    <ArrowForwardIosRoundedIcon
                      fontSize="large"
                      className="prev"
                      onClick={() => setSlideIx((prevIx) => prevIx - 1)}
                    />
                    {/* card area: card, numerical page indicator, and dot indicator */}
                    <div className="within-card">
                      {/* card */}
                      <DetailCard
                        cardType={cardType}
                        labels={labels}
                        allInfo={allInfo}
                        contentType = {contentType}
                        pfpSrc = {pfpSrc}
                      />
                      {/* numerical indicator */}
                      <span className="num-text">{slideIx + 1}/4</span>
                      {/* dot indicator */}
                      <div className="three-dots">
                        <button
                          className={activeDot === 1 ? "active dot" : "dot"}
                          onClick={() => setSlideIx(0)}
                        ></button>
                        <button
                          className={activeDot === 2 ? "active dot" : "dot"}
                          onClick={() => setSlideIx(1)}
                        ></button>
                        <button
                          className={activeDot === 3 ? "active dot" : "dot"}
                          onClick={() => setSlideIx(2)}
                        ></button>
                        <button
                          className={activeDot === 4 ? "active dot" : "dot"}
                          onClick={() => setSlideIx(23)}
                        ></button>
                      </div>
                    </div>
                    {/* next arrow */}
                    <ArrowForwardIosRoundedIcon
                      fontSize="large"
                      className="next"
                      onClick={() => setSlideIx((prevIx) => prevIx + 1)}
                    />
                  </div>
                </>
              ) : (
                <NotFound />
              )}
            </>
          )}
        </>
      ) : (
        <NotAuthorized />
      )}
    </>
  );
}
