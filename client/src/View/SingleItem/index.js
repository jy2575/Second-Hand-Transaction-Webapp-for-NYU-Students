import React, { useState, useEffect, useContext } from "react";
import { useLocation, useParams, Link, useHistory } from "react-router-dom";
import CustomAppBar from "Components/CustomAppBar/CustomAppBar";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Avatar from "Assets/img/faces/avatar-example.jpg";
import ImagePlaceholder from "Assets/img/img-placeholder.png";
import getProfile from "Controller/getProfile";
import getChats from "Controller/Chat/getChats";
import CustomCarousel from "Components/Carousel";
import { AuthContext } from "Context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Auth } from "aws-amplify";

import checkout from "Controller/Checkout/checkout";
import deleteListing from "Controller/Listing/deleteListing";

const useStyle = makeStyles((theme) => ({
  container: {
    marginTop: "15vh",
    margin: "auto",
    maxWidth: "70vw",
    width: "95%",
  },
  row: {
    display: "flex",
  },
  avatarRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 80,
  },
  imageContainer: {
    width: "50%",
    height: "70vh",
  },
  portrait: {
    width: 400,
    height: 550,
    border: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  coverImg: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  itemInfoContainer: {
    marginLeft: "3vw",
    width: "30vw",
  },
  pricetag: {
    color: theme.palette.primary.main,
  },
  sellerInfo: {
    color: "grey",
    width: 150,
    position: "relative",
  },
  avatar: {
    borderRadius: "50%",
    position: "absolute",
    right: 0,
    top: -18,
  },
  longbtn: {
    width: "100%",
    padding: theme.spacing(1),
  },
}));

const PoppinsFont = withStyles((theme) => ({
  root: {
    fontFamily: "Roboto",
    paddingBottom: "20px",
  },
}))(Typography);

const SingleItem = () => {
  const { postId } = useParams();
  const location = useLocation();
  const item = location.state;
  const classes = useStyle();
  const [
    authStatus,
    setAuthStatus,
    checkStatus,
    token,
    setToken,
    username,
  ] = useContext(AuthContext);
  // tmep code
  let imgurlArr = [];
  let price;
  if (item.image_url) {
    imgurlArr.push(item.image_url);
  } else if (item.cover_image_url) {
    imgurlArr.push(item.cover_image_url);
    imgurlArr = imgurlArr.concat(item.detail_image_urls);
  } else {
    imgurlArr.push(ImagePlaceholder);
  }
  if (item.price) {
    price = item.price;
  } else {
    price = item.original_price;
  }
  const [avatarUrl, setAvatarUrl] = useState();
  const [chatId, setChatId] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const wrapper = async () => {
      const res = await getChats(token);
      const chats = res.data;
      const foundChat = chats.find((chat) => chat.name === item.title);
      setChatId(foundChat ? foundChat._id : null);
    };
    wrapper();
  }, []);

  // fetch user avatar
  useEffect(() => {
    const getAvatarUrl = async () => {
      const res = await getProfile(item?.user_id);
      // show error if request is failed
      console.log(res.data);
      res.success && setAvatarUrl(res.data.avatarUrl);
    };
    getAvatarUrl();
  }, [avatarUrl]);

  /* initialize stripe payment
    code from https://stripe.com/docs/payments/accept-a-payment?integration=elements
  */
  const handleClick = async (e) => {
    if (e.target.textContent === "Delete this item") {
      await deleteListing(item._id, token);
      history.push("/home");
    } else {
      // Get Stripe.js instance

      try {
        const stripePromise = loadStripe(
          "pk_test_51Ht0mwFHEiDr6rf2IHuPzpEo3j7hDKwDtFLBfOAebHTu7WPyOQh9xis5XOsyWwffHUNgwzzT6gR7CT9HTZutsIjX00dq1LRvzu"
        );
        const stripe = await stripePromise;

        const integerPrice = parseInt(
          parseFloat(
            (item.price ? item.price : item.original_price).replaceAll(",", "")
          )
        );
        // Call your backend to create the Checkout Session
        const data = {
          price: integerPrice,
          title: item.title,
          itemId: item._id,
          buyer: username,
        };

        const session = (await checkout(data)).data;
        console.log(session.id);

        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
        if (result.error) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer
          // using `result.error.message`.
          console.log(result.error.message);
        }
      } catch (err) {
        console.log(err);
        console.log("error: cannot start payment");
      }
    }
  };

  return (
    <div className={classes.container}>
      <CustomAppBar />
      <div className={classes.row}>
        <div className={classes.imageContainer}>
          <CustomCarousel images={imgurlArr} />
        </div>

        <div className={classes.itemInfoContainer}>
          <PoppinsFont variant="h4" style={{ fontWeight: 800 }}>
            {item?.title}
          </PoppinsFont>
          <div className={classes.avatarRow}>
            <PoppinsFont variant="h4" className={classes.pricetag}>
              ${price}
            </PoppinsFont>
            <div className={classes.sellerInfo}>
              <PoppinsFont variant="p" className={classes.postedby}>
                by {item?.user_id}
              </PoppinsFont>
              <img
                src={avatarUrl}
                className={classes.avatar}
                width={60}
                height={60}
                alt="user avatar"
              ></img>
            </div>
          </div>
          <Typography variant="h5">Item description:</Typography>
          <PoppinsFont variant="subheader1">{item?.description}</PoppinsFont>
          <br />
          <br />
          <Typography variant="h5">Shipment:</Typography>
          <PoppinsFont variant="subheader1">{item?.shipment}</PoppinsFont>
          <br />
          <br />
          <br />
          <br />

          {item?.user_id === username ? (
            <Button
              className={classes.longbtn}
              variant="outlined"
              color="primary"
              value="delete"
              onClick={(e) => handleClick(e)}
            >
              Delete this item
            </Button>
          ) : (
            <>
              <Button
                className={classes.longbtn}
                variant="outlined"
                color="primary"
                value="buy"
                onClick={(e) => handleClick(e)}
              >
                Buy
              </Button>
              <p style={{ textAlign: "center" }}> or have questions? </p>
              <Button
                className={classes.longbtn}
                variant="outlined"
                color="primary"
                component={Link}
                to={{
                  pathname: `/chat/${chatId ? chatId : "new"}`,
                  listingInfo: item,
                }}
              >
                Chat with the seller!
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
