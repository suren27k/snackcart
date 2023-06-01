import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getAllOrdersOfUser } from "../../action/profile";
import Loader from "../UI/Loader";
import ProfileNavbar from "./ProfileNavbar";

const Profile = ({ isAuthDone }) =>
{
	const [loader, setLoader] = useState(false);
	const [items, setItems] = useState([]);
	const dispatcher = useDispatch();
	let navigate = useNavigate();
	let orders = [];
	const token = localStorage.getItem("token");
	const location = useLocation();
	// console.log("token: " + token)

	useEffect(() =>
	{
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
					const respData = response.data;
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
					setItems(ordersMap);
					// orders = response.data;
					// console.log("orders ---> ");
					// console.log(data);
				}
				else
				{
					// console.log("Yes response error")
					alert(response.data.error || "Some generic msg incase key missing");
					setLoader(false);

					console.log("inside callback in profile js --> location is: " + location.pathname);

					console.log(response);

					if (response.error && location.pathname === "/profile/info")
					{
						if (response.status === 400)
						{
							alert("Please login to access this page.");
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
			getOrdersRequest();
		}

		//clean up function which runs when component is destroyed
		return () =>
		{
			setItems([]);
			setLoader(false);
		}

	}, [isAuthDone]);


	return (
		<>
			{(() =>
			{

				if (token === null)
				{
					return (
						<Navigate to="/login" />
					)

				}
				else
				{
					return (
						<>
							<ProfileNavbar />
							<main>
								<NavLink to="/">Go Back</NavLink>
								<div>
									<h3>Your Orders</h3>
								</div>

								{loader && <Loader />}
							</main>
						</>
					)

				}
			})()}


		</>

	);
}

export default Profile;