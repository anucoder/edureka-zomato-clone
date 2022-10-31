import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../Header";
import { useParams } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from "react-responsive-carousel";
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

function RestaurantPage() {
  let [tab, setTab] = useState(1);
  let { id } = useParams();
  let initData = {
    name: "",
    city: "",
    location_id: null,
    city_id: -1,
    locality: "",
    thumb: [],
    aggregate_rating: null,
    rating_text: "",
    min_price: null,
    contact_number: null,
    cuisine_id: [],
    cuisine: [],
    image: "assets/breakfast.png",
    mealtype_id: null,
    _id: -1,
  };
  let [restaurant, setRestaurantDetails] = useState({ ...initData });
  let [menuItems, setMenuItems] = useState([]);
  let [totalPrice, setTotalrice] = useState(0);

  //Userdetails
  let getTokenDetails = () => {
    // read the data from localStorage
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };
  let [userDetails, setUserDetails] = useState(getTokenDetails());


  //Restaurant details
  let getRestaurantDetails = async () => {
    let URL = "https://zomato-clone-int-project.herokuapp.com/api/get-restaurant-details/" + id;
    try {
      let { data } = await axios.get(URL);
      if (data.status === true)
        setRestaurantDetails({ ...data.restaurantDetails });
      else setRestaurantDetails({ ...initData });
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  //Menu management

  let getMenuItems = async () => {
    // console.log(id);
    let URL1 = "https://zomato-clone-int-project.herokuapp.com/api/get-menu-items-by-restId/" + id;
    try {
      let { data } = await axios.get(URL1);
      if (data.status === true) setMenuItems([...data.menu]);
      else setMenuItems([]);
      setTotalrice(0);
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  let addMenuItemsTotal = (index) => {
    let _price = Number(menuItems[index].price);
    let _menuItems = [...menuItems];
    _menuItems[index].qty += 1;
    setTotalrice(totalPrice + _price);
    setMenuItems(_menuItems);
  };

  let removeMenuItemsTotal = (index) => {
    let _price = Number(menuItems[index].price);
    let _menuItems = [...menuItems];
    _menuItems[index].qty -= 1;
    setTotalrice(totalPrice - _price);
    setMenuItems(_menuItems);
  };

  //Razorpay

 async function loadScript() {
    let status = false;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    window.document.body.appendChild(script);
      
         script.onload = () => {
          //console.log("returning true")
            status = true;
          };
          script.onerror = () => {
            //console.log("returning false")
            status = false;
          };
      
    }

  let displayRazorpay = async () => {
    let isLoaded = await loadScript();
    //console.log(isLoaded)
    if (isLoaded === false) {
      alert("sdk not loaded");
      return false;
    }
    var serverData = {
      amount : totalPrice
    }
    var {data} = await axios.post(
      "https://zomato-clone-int-project.herokuapp.com/api/payment/gen-order",serverData
    );
      var order = data.order;

    var options = {
      key: "rzp_test_rrlnhLgPkYoMK8", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Zomato Clone",
      description: "Paying for selected items",
      image:
        "https://branditechture.agency/brand-logos/wp-content/uploads/wpdm-cache/Screenshot_20220621-202824-900x0.png",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        var sendData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
        var { data } = await axios.post(
          "https://zomato-clone-int-project.herokuapp.com/api/payment/verify",
          sendData
        );
        if(data.status===true){
          Swal.fire({
            icon: "success",
            title: "Payment done successfully",
            text: "",
          }).then(() => {
            window.location.replace("/");
          });
          
        } 
        else {
          Swal.fire({
            icon: "error",
            title: "Payment failed !! Try again.",
            text: "",
          })
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    // function loadingScript() {
    //   var razorpayObject = window.Razorpay(options);
    //   razorpayObject.open();
    // }
    
    // new Promise(resolve=>{setTimeout(()=>resolve(loadingScript()), 1000);});
    

    var razorpayObject = window.Razorpay(options);
    razorpayObject.open();

  };

  useEffect(() => {
    getRestaurantDetails();
  }, []);

  return (
    <>
    {/* slideShow */}
      <div
        className="modal fade"
        id="slideShow"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh" }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              <Carousel showThumbs={false} infiniteLoop={true}>
                {restaurant.thumb.map((value, index) => {
                  return (
                    <div key={index} className="w-100">
                      <img src={"/images/" + value} />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      {/* MenuItems */}
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ">
              {menuItems.map((menuItem, index) => {
                return (
                  <div className="row p-2" key={index}>
                    <div className="col-8 ">
                      <p className="mb-1 h6">{menuItem.name}</p>
                      <p className="mb-1">@{menuItem.price}</p>
                      <p className="small text-muted">{menuItem.description}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/images/" + menuItem.image} alt="" />
                        {menuItem.qty === 0 ? (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => addMenuItemsTotal(index)}
                          >
                            Add
                          </button>
                        ) : (
                          <div className="order-item-count section ">
                            <span
                              className="hand"
                              onClick={() => removeMenuItemsTotal(index)}
                            >
                              -
                            </span>
                            <span>{menuItem.qty}</span>
                            <span
                              className="hand"
                              onClick={() => addMenuItemsTotal(index)}
                            >
                              +
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <hr className=" p-0 my-2" />
                  </div>
                );
              })}
              {totalPrice > 0 ? (
                <div className="d-flex justify-content-between">
                  <h3>Subtotal : {totalPrice}</h3>
                  <button
                    className="btn btn-danger"
                    data-bs-target="#exampleModalToggle2"
                    data-bs-toggle="modal"
                  >
                    Pay Now
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter User Name"
                    value={userDetails.name}
                    readOnly={true}
                    onChange={() => {}}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={userDetails.email}
                    placeholder="eg.name@example.com"
                    readOnly={true}
                    onChange={() => {}}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="" className="form-label">
                    Address
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value=""
                    onChange={() => {}}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Back to Menu
              </button>
              <button className="btn btn-success" onClick={displayRazorpay}>
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RestaurantPage */}
      <Header color="bg-danger" logo={true}/>
      <section className="row justify-content-center">
        <section className="col-11 mt-2 restaurant-main-image position-relative">
          <img src={"/images/" + restaurant.image} alt="" />
          <button
            className="btn-gallery position-absolute btn"
            data-bs-toggle="modal"
            data-bs-target="#slideShow"
          >
            Click to see Image Gallery
          </button>
        </section>
        <section className="col-11">
          <h2 className="mt-3">{restaurant.name}</h2>
          <div className="d-flex justify-content-between align-items-start">
            <ul className="list-unstyled d-flex gap-3 fw-bold">
              <li className="pb-2 hand" onClick={() => setTab(1)}>
                Overview
              </li>
              <li className="pb-2 hand" onClick={() => setTab(2)}>
                Contact
              </li>
            </ul>
            {userDetails ? (<button
              data-bs-toggle="modal"
              href="#exampleModalToggle"
              role="button"
              className="btn btn-danger"
              onClick={getMenuItems}
            >
              Place Online Order
            </button>) : <button className="btn btn-danger" disabled={true}> Please Login to place an order</button>}
          </div>
          {tab === 1 ? (
            <section>
              <h4 className="mb-3">About this place</h4>
              <p className="m-0 fw-bold">Cuisine</p>
              <p className="mb-3 text-muted small">
                {restaurant.cuisine.length > 0
                  ? restaurant.cuisine.reduce((pVal, cVal) => {
                      return pVal.name + " , " + cVal.name;
                    })
                  : null}
              </p>

              <p className="m-0 fw-bold">Average Cost</p>
              <p className="mb-3 text-muted small">₹{restaurant.min_price}</p>
            </section>
          ) : (
            <section>
              <h4 className="mb-3">Contact</h4>
              <p className="m-0 fw-bold">Phone Number</p>
              <p className="mb-3 text-danger small ">
                +{restaurant.contact_number}
              </p>

              <p className="m-0 fw-bold">{restaurant.name}</p>
              <p className="mb-3 text-muted small">
                {restaurant.locality},{restaurant.city}
              </p>
            </section>
          )}
        </section>
      </section>
    </>
  );
}

export default RestaurantPage;
