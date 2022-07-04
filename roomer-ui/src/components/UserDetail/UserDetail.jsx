import * as React from "react";
import "./UserDetail.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BASE_API_URL } from "../../constants";
import NotFound from "../NotFound/NotFound";
import DetailCard from "../DetailCard/DetailCard";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function UserDetail() {
  let { userId } = useParams();
  let [basicInfo, setBasicInfo] = useState({});
  let [extendedInfo, setExtendedInfo] = useState({});
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
  const getBasicInfo = () => {
    axios({
      method: "get",
      url: `${BASE_API_URL}/connect/${userId}`,
    })
      .then((response) => {
        setBasicInfo((basicInfo = response.data.user));
      })
      .catch((e) => {
        setSuccess(false);
      })
  };

  /**
   * Execute a GET request to get an individual user's extended preferences.
   * Set the `extendedInfo` state variable to the contents of the response.
   */
  const getExtendedInfo = () => {
    axios({
      method: "get",
      url: `${BASE_API_URL}/extend/${userId}`,
    })
      .then((response) => {
        setExtendedInfo((extendedInfo = response.data.extended));
      })
      .catch((e) => {
        setSuccess(false);
      })
  };

  useEffect(() => {
    getBasicInfo();
    getExtendedInfo();
  }, []);

  useEffect(() => {
    // to prevent indices > 3
    setSlideIx((curIx) => curIx % 3);

    // to prevent negative indices
    if (slideIx < 0) {
      setSlideIx(0);
    }

    if (slideIx === 0) {
      setActiveDot(1);
      setCardType("basic");
      setLabels(["Age", "Location", "Occupation"]);
      setAllInfo([
        basicInfo.name,
        basicInfo.age,
        basicInfo.location,
        basicInfo.occupation,
      ]);
    } else if (slideIx === 1) {
      setActiveDot(2);
      setCardType("extended");
      setLabels([
        "Profession",
        "Location radius",
        "Gender preference",
        "Age preference",
      ]);

      setAllInfo([
        basicInfo.name,
        extendedInfo.profession,
        extendedInfo.radius,
        extendedInfo.gender_pref,
        extendedInfo.age_pref,
      ]);
    } else if (slideIx === 2) {
      setActiveDot(3);
      setCardType("optional");
      setLabels([]);
      const dummyBio =
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nobis repellendus sed harum quas eaque necessitatibus labore expedita dolore illum exercitationem assumenda sit et velit, odit doloremque. Voluptates sint rem error itaque laboriosam doloribus distinctio voluptate dolorum debitis nam nostrum consequuntur deleniti, facilis quasi magnam placeat commodi officiis ipsam expedita!";
      setAllInfo([basicInfo.name, dummyBio]);
    }
  }, [slideIx, basicInfo, extendedInfo]);

  return (
    <>
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
                cardId={userId}
                cardType={cardType}
                allInfo={allInfo}
                labels={labels}
              />
              {/* numerical indicator */}
              <span className="num-text">{slideIx + 1}/3</span> 
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
  );
}
