import { Spinner } from 'react-bootstrap';

const PageLoader = (props) => {
	console.log(props)
	return (
		<>
			<div style={{
				"position": "fixed",
				//"display": "block",
				"width": "100%",
				"height": "100%",
				"top": "0",
				"left": "0",
				"right": "0",
				"bottom": "0",
				"background-color": "rgba(255, 255, 255, 0.9)",
				"z-index": "999"
				}}>

			</div>
			<div style={{
				"z-index": "1000",
				"position": "absolute",
				"top": "50%",
				"left": "50%",
				"font-size": "20px",
				"color": "black",
				"transform": "translate(-50%,-50%)",
				"-ms-transform": "translate(-50%,-50%)"
			}} className="text-center">
				<Spinner variant="secondary" {...props} animation="border" role="status">
					<span className="sr-only">Loading...</span>
				</Spinner>
				<span className="ml-2">Loading please wait...</span>
			</div >
		</>
	)
}

export default PageLoader;
