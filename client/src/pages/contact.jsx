import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import "antd/dist/antd.css";
import "bulma/css/bulma.min.css";
import "../components/showcase.css";
import axios from "axios";
import Recaptcha from "react-google-recaptcha";

const layout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 12,
	},
};

const validateMessages = {
	required: "${label} is required!",
	types: {
		email: "${label} is not valid email!",
	},
};

const marginBottom = { marginBottom: "2em" };

function Contact(params) {
	const [isVerified, setIsVerified] = useState(false);
	const [captcha, setCaptcha] = useState("");
	const [form] = Form.useForm();

	function onChangeRecaptcha(value) {
		setCaptcha(value);
		setIsVerified(true);
	}

	const onFinish = (values) => {
		if (isVerified) {
			values.recaptcha = captcha;
			axios
				.post("/api/contact-me", values)
				.then((res) => console.log(res))
				.catch((error) => console.log(error));
			window.location = "/";
		} else {
			message.error("Please verify that you are a human!");
		}
	};

	return (
		<React.Fragment>
			<section className="section">
				<div className="container">
					{" "}
					<h1
						className="subtitle font"
						style={{ textAlign: "center" }}
					>
						If you would like to contact me, <br /> please use the
						form below
					</h1>
					<Form
						onFinish={onFinish}
						{...layout}
						form={form}
						name="Contact Message"
						validateMessages={validateMessages}
					>
						<Form.Item
							style={marginBottom}
							name="name"
							label="Name"
							rules={[
								{
									required: true,
								},
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							style={marginBottom}
							name="email"
							label="Email"
							rules={[
								{
									required: true,
									type: "email",
								},
							]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							style={marginBottom}
							name="message"
							label="Message"
							rules={[
								{
									required: true,
								},
							]}
						>
							<Input.TextArea
								autoSize={{ minRows: 3, maxRows: 10 }}
							/>
						</Form.Item>

						<Form.Item
							wrapperCol={{ ...layout.wrapperCol, offset: 6 }}
						>
							<Recaptcha
								sitekey="6LevhNkZAAAAABvtk2j7bEhd-tJrxpPWH_rphULH"
								onChange={onChangeRecaptcha}
							/>
						</Form.Item>

						<Form.Item
							wrapperCol={{ ...layout.wrapperCol, offset: 6 }}
						>
							<Button type="primary" htmlType="submit">
								Send
							</Button>
						</Form.Item>
					</Form>
				</div>
			</section>
		</React.Fragment>
	);
}

export default Contact;
