import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getAllOrdersOfUser } from "../../action/profile";
import Loader from "../UI/Loader";
import ProfileNavbar from "./ProfileNavbar";

const Orders = ({ isAuthDone }) =>
{
	const [loader, setLoader] = useState(false);
	const [showContent, setShowContent] = useState(false);
	const [items, setItems] = useState([]);
	const dispatcher = useDispatch();
	let navigate = useNavigate();
	const location = useLocation();
	const token = localStorage.getItem("token");
	const [isOrdersEmpty, setIsOrdersEmpty] = useState(false);

	useEffect(() =>
	{
		// console.log("inside orders.js useeffect")

		async function getOrdersRequest()
		{
			setLoader(true);
			await dispatcher(getAllOrdersOfUser(response =>
			{
				//callback function

				// console.log(response);

				if (!response.error)
				{
					setLoader(false);
					// console.log(response.data)
					let respData = response.data;
					if (respData === null)
					{
						// console.log("orders is null in orders js")

						respData = [];
						setIsOrdersEmpty(true);
						setShowContent(true);
						return;
					}

					const orderIdArray = Object.keys(respData)
					// console.log("orderIdArray: " + orderIdArray);

					let ordersMap = [];
					orderIdArray.forEach((id, index) =>
					{
						// console.log("id: " + id + " --> index: " + index);
						ordersMap[index] = {
							...respData[id],
							id: id
						}
					});

					// console.log("ordersMap: " + ordersMap)
					// console.log(ordersMap)

					// const data = respData.map((item) => item);
					setItems(ordersMap.reverse());
					// orders = response.data;
					// console.log("orders ---> ");
					// console.log(data);

					setShowContent(true);
				}
				else
				{
					// console.log("Yes response error")
					alert(response.data.error || "Some generic msg incase key missing");
					setLoader(false);

					// console.log("inside callback in profile js --> location is: " + location.pathname);

					// console.log(response);

					if (response.error)
					{
						if (response.status === 400)
						{
							alert("Session expired. Please login again to continue...");
							localStorage.removeItem("token");
							navigate("/login");
						}
						else if (response.status === 401)
						{
							alert("Session expired. Please login again to continue...");
							localStorage.removeItem("token");
							navigate("/login");
						}
						else if (response.status === 404)
						{
							alert("Please login to access this page");
							navigate("/login");
						}

					}
				}

			}));
		}

		if (isAuthDone)
		{
			// console.log("inside orders.js : isauthdone is true finally!!")
			getOrdersRequest();
		}

		// setTimeout(() =>
		// {
		// 	if (!isAuthDone)
		// 	{
		// 		alert("reloading via timeout")
		// 		window.location.reload(false);
		// 	}
		// }, 5000);

		//clean up function which runs when component is destroyed
		return () =>
		{
			setItems([]);
			setLoader(false);
		}

	}, [isAuthDone]);


	const viewOrderAction = () =>
	{
		alert("Yet to implement this!")
	}

	return (
		<>
			<ProfileNavbar />

			{(() =>
			{

				if (token === null)
				{
					return (
						<Navigate to="/login" />
					)

				}
				else if (showContent)
				{
					return (
						<>
							<h1>Your Orders</h1>

							<section className="orders-section">

								<ul className="orders-list">
									{isOrdersEmpty &&
										<>
											<div className="empty-orders">No orders yet!  : /</div>

										</>
									}
									{!isOrdersEmpty &&
										items.map((item, index) =>
										{

											return (
												<li className="order-item" key={item.id}>
													<div className="order-item-number">
														<div>{index + 1}</div>
													</div>
													<div className="order-item-info">
														<div className="order-item-info-text">
															<div className="order-body">

																<p>Order Id: {item.id}</p>
																<p>Ordered On: {item.orderedOn.day + " " + item.orderedOn.time}</p>
																<p>Items ordered: {item.items.length}</p>
															</div>
															<hr></hr>
															<div className="order-footer">

																<p>Total Amount: {item.totalAmount}</p>
															</div>
														</div>
														<div className="order-item-info-img">
															<div className="row">
																<div className="column">
																	<img alt="item-image1" className="img-fluid" src={`/assets/${item.items[0].thumbnail}`} />
																</div>
																<div className="column">
																	<img alt="item-image2" className="img-fluid" src={`/assets/${item.items[1].thumbnail}`} />
																</div>

															</div>
															{item.items.length > 2 &&
																<div className="order-item-info-quantity">
																	<p>+{item.items.length - 2} more</p>
																</div>
															}
														</div>
													</div>
													<div className="order-item-link">
														<button onClick={viewOrderAction}>View</button>
													</div>
												</li>
											);
										})}

								</ul>
								{loader && <Loader />}
							</section>
						</>)
				}
			})()}
		</>
	);
}

export default Orders;