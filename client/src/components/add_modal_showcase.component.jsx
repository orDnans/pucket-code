import React, { useState } from "react";
import { Modal, Form, Select, Input, DatePicker, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const { Option } = Select;
const { RangePicker } = DatePicker;

// Convert image to Base64. Used for the image preview
function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

function AddModal(params) {
	const [form] = Form.useForm();
	// const [fileList, setFileList] = useState(params.fileList);

	// Used for preview images
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");
	const alignments = ["Left", "Right"];
	const section = params.section;

	// Used for the validation messages of the form
	const validateMessages = {
		required: "${label} is required",
	};

	// Upload button HTML body
	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>
				Click or Drag <br /> to upload
			</div>
		</div>
	);

	// Handle upload of image file
	function handleUpload({ fileList }) {
		// console.log("File", fileList);
		params.setFileList(fileList);

		// Used to enforce that an image is required to add a showcase
		if (form.getFieldValue("image").fileList.length === 0) {
			// Set the value of the image field to null
			form.setFieldsValue({ image: null });
		}
		// console.log("fileList", fileList);
		// console.log("Image:", form.getFieldValue("image"));
	}

	// Handle edit modal's cancel
	function handleCancel() {
		setPreviewVisible(false);
	}

	// Handle the image preview
	async function handlePreview(file) {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewVisible(true);
		setPreviewTitle(
			file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
		);
	}

	// On ok, send values which contains the values of the new showcase and the new image to the current section component which would handle the request to the server
	function onOk() {
		form.validateFields()
			.then((values) => {
				params.changeLoading(true);
				values.image = params.fileList[0].originFileObj;
				params.onCreate(values);
			})
			.catch((info) => {
				console.log("Validate Failed:", info);
			});
	}

	return (
		<Modal
			visible={params.visible}
			title="Add"
			okText="Add"
			cancelText="Cancel"
			onCancel={params.onCancel}
			destroyOnClose={true}
			centered
			onOk={onOk}
			confirmLoading={params.loading}
		>
			<Form
				form={form}
				preserve={false}
				layout="vertical"
				name="edit"
				initialValues={params.showcase}
				validateMessages={validateMessages}
			>
				<Form.Item
					name="title"
					label="Title"
					rules={[
						{
							required: true,
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="alignment"
					label="Alignment"
					rules={[
						{
							required: true,
						},
					]}
				>
					<Select placeholder="Select an alignment" allowClear>
						{alignments.map((alignment) => {
							return (
								<Option key={alignment} value={alignment}>
									{alignment}
								</Option>
							);
						})}
					</Select>
				</Form.Item>
				{/* Render the dates if the current section is the academic experience page */}
				{section === "academicExperience" ? (
					<Form.Item
						name="dates"
						label="Dates"
						rules={[
							{
								required: true,
							},
						]}
					>
						<RangePicker />
					</Form.Item>
				) : null}

				<Form.Item
					name="description"
					label="Description"
					rules={[
						{
							required: true,
						},
					]}
				>
					<Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
				</Form.Item>
				<Form.Item
					label="Image"
					rules={[{ required: true, message: "Image is required" }]}
					required
				>
					<Form.Item
						name="image"
						rules={[
							{ required: true, message: "Image is required" },
						]}
					>
						<Upload
							listType="picture-card"
							fileList={params.fileList}
							onPreview={handlePreview}
							onChange={handleUpload}
							beforeUpload={() => false}
						>
							{params.fileList.length >= 1 ? null : uploadButton}
						</Upload>
					</Form.Item>
					<Modal
						visible={previewVisible}
						title={previewTitle}
						footer={null}
						onCancel={handleCancel}
					>
						<img
							alt="example"
							style={{ width: "100%" }}
							src={previewImage}
						/>
					</Modal>
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default AddModal;
