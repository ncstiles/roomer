import * as React from "react";
import "./UserDetail.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BASE_API_URL } from "../../constants";
import NotFound from "../NotFound/NotFound";
import DetailCard from "../DetailCard/DetailCard";
import Loading from "../Loading/Loading";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function UserDetail() {
  let { username } = useParams();
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

  /**
   * Execute a GET request to get an individual user's basic info.
   * Set the `basicInfo` state variable to the contents of the response.
   */
  const getBasicInfo = async () => {
    return axios({
      method: "get",
      url: `${BASE_API_URL}/basic/${username}`,
    })
      .then((response) => {
        setBasicInfo((basicInfo = response.data.basicData));
      })
      .catch((e) => {
        setSuccess(false);
      });
  };

  /**
   * Execute a GET request to get an individual housing information.
   * Set the `housingInfo` state variable to the contents of the response.
   */
  const getHousingInfo = async () => {
    return axios({
      method: "get",
      url: `${BASE_API_URL}/housing/${username}`,
    })
      .then((response) => {
        setHousingInfo((housingInfo = response.data.housingData));
      })
      .catch((e) => {
        setSuccess(false);
      });
  };

  /**
   * Execute a GET request to get an individual user's preferences.
   * Set the `preferenceInfo` state variable to the contents of the response.
   */
  const getPreferenceInfo = async () => {
    return axios({
      method: "get",
      url: `${BASE_API_URL}/preferences/${username}`,
    })
      .then((response) => {
        setPreferenceInfo((preferenceInfo = response.data.preferenceData));
      })
      .catch((e) => {
        setSuccess(false);
      });
  };

  /**
   * Execute a GET request to get an individual user's extra info.
   * Set the `extraInfo` state variable to the contents of the response.
   */
  const getExtraInfo = async () => {
    return axios({
      method: "get",
      url: `${BASE_API_URL}/extra/${username}`,
    })
      .then((response) => {
        setExtraInfo((extraInfo = response.data.extraData));
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
    Promise.all([
      getBasicInfo(),
      getHousingInfo(),
      getPreferenceInfo(),
      getExtraInfo(),
    ]).then(() => {
      setIsLoading(false);
    });
  }, []);

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
  );
}
