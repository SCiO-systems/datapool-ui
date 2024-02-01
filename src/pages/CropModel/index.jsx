import React, { useEffect, useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import axios from 'axios';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import './styles.css';
import UploadComponent from '@scioservices/upload-component';
import { useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ToolsService from '../../services/httpService/toolsService';

const CropModel = () => {
	const fileUploadRef = useRef(null);

	const toast = useRef(null);

	const [checked, setChecked] = useState(false);
	const [stataCompatible, setStataCompatible] = useState(false);

	const [generatedFiles, SetGeneratedFiles] = useState(false);

	const [dataLink, SetDataLink] = useState(null);
	const [spssLink, SetSpssLink] = useState(null);

	const [form, setForm] = useState(false);
	const [data, setData] = useState(false);
	const [codebook, setCodebook] = useState(false);

	const [totalSimpleSize, setTotalSimpleSize] = useState(0);
	const [totalDataSize, setTotalDataSize] = useState(0);
	const [totalCodebookSize, setTotalCodebookSize] = useState(0);
	const [totalXlsFormSize, setTotalXlsFormSize] = useState(0);

	const [simpleProgress, setSimpleProgress] = useState(0);
	const [dataProgress, setDataProgress] = useState(0);
	const [codebookProgress, setCodebookProgress] = useState(0);
	const [formProgress, setFormProgress] = useState(0);

	const [selectedModel, setSelectedModel] = useState({ name: 'DSSAT', code: 'dssat' });
	const models = [
		{ name: 'DSSAT', code: 'dssat' },
		{ name: 'Apsim', code: 'apsim' },
	];

	// region NEW CODE

	const { user } = useAuth0(); 
	const location = useLocation();
	const [completedUploads, setCompletedUploads] = useState([]);
	const [datafile, setDatafile] = useState();
	const [downloadLink, setDownloadLink] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (completedUploads.length > 0) {
			setDatafile(completedUploads[0]);
		}
	}, [completedUploads]);

	const handleTransform = () => {
		ToolsService.transformCrop(user.sub, selectedModel.code, datafile)
			.then((r) => {
				setDownloadLink(r);
			});
	};

	const handleDownload = () => {
		axios({
			url: downloadLink, // your url
			method: 'GET',
			responseType: 'blob', // important
		}).then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', datafile); // or any other extension
			document.body.appendChild(link);
			link.click();
			link.remove();
		});
	};

	// endregion

	const onBasicUpload = (event) => {
		setLoading(true);
		setDataProgress(50);

		const get_file_content = (file) => {
			return new Promise((acc, error) => {
				const reader = new FileReader();
				reader.onload = (ev) => { acc(ev.target.result); };
				reader.onerror = (err) => { err(err); };
				reader.readAsArrayBuffer(file);
			});
		};

		const contents = event.files.map(
			(item) => {
				const itemContent = get_file_content(item).then(
					(response) => {
						const responseData = response;

						const config = {
							method: 'post',
							maxBodyLength: Infinity,
							url: 'https://api.node.scio.services/api/naupload',
							headers: {
								'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
							},
							responseData,
						};

						axios.request(config)
							.then((response1) => {
								const link = response1.data;
								const model = selectedModel.code;

								const urls = {
									link,
									model,
								};

								const config2 = {
									method: 'post',
									maxBodyLength: Infinity,
									url: 'https://api.node.scio.services/api/croptransform',
									// url: 'http://localhost:8192/api/allstata',
									headers: {
										'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
									},
									data: urls,
								};

								axios.request(config2)
									.then((response2) => {
										const result = response2.data;

										const element = document.createElement('a');
										element.setAttribute('href', result.download_link);
										element.setAttribute('download', '');
										element.style.display = 'none';
										document.body.appendChild(element);
										element.click();
										document.body.removeChild(element);
										//
										//
										// window.open(result.download_link_spss, '_blank');
										//
										// /*let nelement = document.createElement('a');
										// nelement.setAttribute('href', result.download_link_spss);
										// // element.setAttribute('download');
										// nelement.style.display = 'none';
										// document.body.appendChild(nelement);
										// nelement.click();
										// document.body.removeChild(nelement);*/

										/* SetDataLink(result.download_link);
                                        SetSpssLink(result.download_link_spss);

                                        SetGeneratedFiles(true); */

										setLoading(false);
										toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data transformation completed successfully. Please download generated files.' });
									})
									.catch((error) => {
										SetGeneratedFiles(false);
										SetDataLink(null);
										SetSpssLink(null);

										setLoading(false);
										toast.current.show({ severity: 'error', summary: 'File Error', detail: 'Error in provided files. Please try again.' });
										// console.log(error);
									});

								setDataProgress(100);
								// setLoading(false);
								toast.current.show({ severity: 'success', summary: 'Success', detail: 'ODK Data file uploaded successfully.' });
							})
							.catch((error) => {
								setDataProgress(0);
								setLoading(false);
								toast.current.show({ severity: 'error', summary: 'File Error', detail: 'Problem uploading ODK Data file. Please try again.' });
								// console.log(error);
							});
					}
				);
				return itemContent;
			}
		);
	};

	const onAdvancedFormUpload = (ev) => {
		setLoading(true);
		setFormProgress(50);

		const get_file_content = (file) => {
			return new Promise((acc, error) => {
				const reader = new FileReader();
				reader.onload = (event) => { acc(event.target.result); };
				reader.onerror = (err) => { err(err); };
				reader.readAsArrayBuffer(file);
			});
		};

		const contents = ev.files.map(
			(item) => {
				const itemContent = get_file_content(item).then(
					(response) => {
						const responseData = response;

						const config = {
							method: 'post',
							maxBodyLength: Infinity,
							url: 'https://api.node.scio.services/api/naupload',
							headers: {
								'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
							},
							responseData,
						};

						axios.request(config)
							.then((response1) => {
								setForm(response1.data);

								setFormProgress(100);
								setLoading(false);
								toast.current.show({ severity: 'success', summary: 'Success', detail: 'XLS Form uploaded successfully.' });
							})
							.catch((error) => {
								setFormProgress(0);
								setLoading(false);
								toast.current.show({ severity: 'error', summary: 'File Error', detail: 'Problem uploading XLS Form. Please try again.' });

								// console.log(error);
							});
					}
				);
				return itemContent;
			}
		);
	};

	const onAdvancedDataUpload = (ev) => {
		setLoading(true);
		setDataProgress(50);

		const get_file_content = (file) => {
			return new Promise((acc, error) => {
				const reader = new FileReader();
				reader.onload = (event) => { acc(event.target.result); };
				reader.onerror = (err) => { err(err); };
				reader.readAsArrayBuffer(file);
			});
		};

		const contents = ev.files.map(
			(item) => {
				const itemContent = get_file_content(item).then(
					(response) => {
						const responseData = response;

						const config = {
							method: 'post',
							maxBodyLength: Infinity,
							url: 'https://api.node.scio.services/api/naupload',
							headers: {
								'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
							},
							responseData,
						};

						axios.request(config)
							.then((response1) => {
								setData(response1.data);
								setDataProgress(100);
								setLoading(false);
								toast.current.show({ severity: 'success', summary: 'Success', detail: 'ODK Data file uploaded successfully.' });
							})
							.catch((error) => {
								setDataProgress(0);
								setLoading(false);
								toast.current.show({ severity: 'error', summary: 'File Error', detail: 'Problem uploading ODK Data file. Please try again.' });
								// console.log(error);
							});
					}
				);
				return itemContent;
			}
		);
	};

	const onAdvancedCodebookUpload = (ev) => {
		setLoading(true);
		setCodebookProgress(50);

		const get_file_content = (file) => {
			return new Promise((acc, error) => {
				const reader = new FileReader();
				reader.onload = (event) => { acc(event.target.result); };
				reader.onerror = (err) => { err(err); };
				reader.readAsArrayBuffer(file);
			});
		};

		const contents = ev.files.map(
			(item) => {
				const itemContent = get_file_content(item).then(
					(response) => {
						const responseData = response;

						const config = {
							method: 'post',
							maxBodyLength: Infinity,
							url: 'https://api.node.scio.services/api/naupload',
							headers: {
								'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
							},
							responseData,
						};

						axios.request(config)
							.then((response1) => {
								setCodebook(response1.data);
								setCodebookProgress(100);
								setLoading(false);
								toast.current.show({ severity: 'success', summary: 'Success', detail: 'Codebook uploaded successfully.' });
							})
							.catch((error) => {
								setCodebookProgress(0);
								setLoading(false);
								toast.current.show({ severity: 'error', summary: 'File Error', detail: 'Problem uploading Codebook. Please try again.' });
								// console.log(error);
							});
					}
				);
				return itemContent;
			}
		);
	};

	const transform = (event) => {
		setLoading(true);

		const type = 'full';

		const urls = {
			type,
			form,
			data,
			codebook,
			stataCompatible,
		};

		// console.log(fileUploadRef);

		// console.log(data);

		const config = {
			method: 'post',
			maxBodyLength: Infinity,
			url: 'https://api.node.scio.services/api/allstata',
			// url: 'http://localhost:8192/api/allstata',
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			},
			data: urls,
		};

		axios.request(config)
			.then((response) => {
				const result = response.data;

				// let element = document.createElement('a');
				// element.setAttribute('href', result.download_link);
				// // element.setAttribute('download');
				// element.style.display = 'none';
				// document.body.appendChild(element);
				// element.click();
				// document.body.removeChild(element);
				//
				//
				// window.open(result.download_link_spss, '_blank');
				//
				// /*let nelement = document.createElement('a');
				// nelement.setAttribute('href', result.download_link_spss);
				// // element.setAttribute('download');
				// nelement.style.display = 'none';
				// document.body.appendChild(nelement);
				// nelement.click();
				// document.body.removeChild(nelement);*/

				SetDataLink(result.download_link);
				SetSpssLink(result.download_link_spss);

				SetGeneratedFiles(true);

				setLoading(false);
				toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data transformation completed successfully. Please download generated files.' });
			})
			.catch((error) => {
				SetGeneratedFiles(false);
				SetDataLink(null);
				SetSpssLink(null);

				setLoading(false);
				toast.current.show({ severity: 'error', summary: 'File Error', detail: 'Error in provided files. Please try again.' });
				// console.log(error);
			});
	};

	const itemTemplateSimple = (file, props) => {
		return (
			<>
				<div>{file.name}</div>
				<div>{props.formatSize}</div>
				<Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onSimpleTemplateRemove(file, props.onRemove)} />

			</>

		);
	};

	const onSimpleTemplateRemove = (file, callback) => {
		setTotalSimpleSize(0);
		callback();
	};

	const onSimpleTemplateSelect = (e) => {
		let totalSize = 0;
		const { files } = e;

		Object.keys(files).forEach((key) => {
			totalSize += files[key].size || 0;
		});

		setTotalSimpleSize(totalSize);
	};

	const onSimpleTemplateClear = () => {
		setTotalSimpleSize(0);
	};

	const headerSimpleTemplate = (options) => {
		const { className, chooseButton, uploadButton, cancelButton } = options;

		if (totalSimpleSize === 0) {
			setSimpleProgress(0);
		}

		const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSimpleSize) : '0 B';

		return (
			<>
				<div style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
					<div style={{ width: '-webkit-fill-available' }}>
						{chooseButton}
						{uploadButton}
						{cancelButton}
					</div>
					<div className="flex align-items-center gap-3 ml-auto" style={{ width: '-webkit-fill-available' }}>
						<span>{formatedValue} / 50 MB</span>
					</div>

				</div>
				<ProgressBar value={simpleProgress} showValue={false} style={{ width: '100%', height: '12px', marginTop: '5px' }} />
			</>

		);
	};

	const itemTemplateXlsForm = (file, props) => {
		return (
			<>
				<div>{file.name}</div>
				<div>{props.formatSize}</div>
				<Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onXlsFormTemplateRemove(file, props.onRemove)} />
			</>

		);
	};

	const onXlsFormTemplateRemove = (file, callback) => {
		setForm(false);
		SetGeneratedFiles(false);
		setTotalXlsFormSize(0);
		callback();
	};

	const onXlsFormTemplateSelect = (e) => {
		let totalSize = 0;
		const { files } = e;

		Object.keys(files).forEach((key) => {
			totalSize += files[key].size || 0;
		});

		setTotalXlsFormSize(totalSize);
	};

	const onXlsFormTemplateClear = () => {
		setTotalXlsFormSize(0);
	};

	const headerXlsFormTemplate = (options) => {
		const { className, chooseButton, uploadButton, cancelButton } = options;

		if (totalXlsFormSize === 0) {
			setFormProgress(0);
		}

		const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalXlsFormSize) : '0 B';

		return (
			<>
				<div style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
					<div style={{ width: '-webkit-fill-available' }}>
						{chooseButton}
						{uploadButton}
						{cancelButton}
					</div>
					<div className="flex align-items-center gap-3 ml-auto" style={{ width: '-webkit-fill-available' }}>
						<span>{formatedValue} / 50 MB</span>
					</div>

				</div>
				<ProgressBar value={formProgress} showValue={false} style={{ width: '100%', height: '12px', marginTop: '5px' }} />
			</>

		);
	};

	const itemTemplateCodebook = (file, props) => {
		return (
			<>
				<div>{file.name}</div>
				<div>{props.formatSize}</div>
				<Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onCodebookTemplateRemove(file, props.onRemove)} />
			</>

		);
	};

	const onCodebookTemplateRemove = (file, callback) => {
		setCodebook(false);
		SetGeneratedFiles(false);
		setTotalCodebookSize(0);
		callback();
	};

	const onCodebookTemplateSelect = (e) => {
		let totalSize = 0;
		const { files } = e;

		Object.keys(files).forEach((key) => {
			totalSize += files[key].size || 0;
		});

		setTotalCodebookSize(totalSize);
	};

	const onCodebookTemplateClear = () => {
		setTotalCodebookSize(0);
	};

	const headerCodebookTemplate = (options) => {
		const { className, chooseButton, uploadButton, cancelButton } = options;

		if (totalCodebookSize === 0) {
			setCodebookProgress(0);
		}

		const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalCodebookSize) : '0 B';

		return (
			<>
				<div style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
					<div style={{ width: '-webkit-fill-available' }}>
						{chooseButton}
						{uploadButton}
						{cancelButton}
					</div>
					<div className="flex align-items-center gap-3 ml-auto" style={{ width: '-webkit-fill-available' }}>
						<span>{formatedValue} / 50 MB</span>
					</div>

				</div>
				<ProgressBar value={codebookProgress} showValue={false} style={{ width: '100%', height: '12px', marginTop: '5px' }} />
			</>

		);
	};

	const itemTemplateData = (file, props) => {
		return (
			<>
				<div>{file.name}</div>
				<div>{props.formatSize}</div>
				<Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onDataTemplateRemove(file, props.onRemove)} />
			</>

		);
	};

	const onDataTemplateRemove = (file, callback) => {
		setData(false);
		SetGeneratedFiles(false);
		setTotalDataSize(0);
		callback();
	};

	const onDataTemplateSelect = (e) => {
		let totalSize = 0;
		const { files } = e;

		Object.keys(files).forEach((key) => {
			totalSize += files[key].size || 0;
		});

		setTotalDataSize(totalSize);
	};

	const onDataTemplateClear = () => {
		setTotalDataSize(0);
	};

	const headerDataTemplate = (options) => {
		const { className, chooseButton, uploadButton, cancelButton } = options;

		if (totalDataSize === 0) {
			setDataProgress(0);
		}

		const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalDataSize) : '0 B';

		return (
			<>
				<div style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
					<div style={{ width: '-webkit-fill-available' }}>
						{chooseButton}
						{uploadButton}
						{cancelButton}
					</div>
					<div className="flex align-items-center gap-3 ml-auto" style={{ width: '-webkit-fill-available' }}>
						<span>{formatedValue} / 50 MB</span>
					</div>

				</div>
				<ProgressBar value={dataProgress} showValue={false} style={{ width: '100%', height: '12px', marginTop: '5px' }} />
			</>

		);
	};

	return (
		<div className="crop-model">

			{loading
				? (
					<div className="progress-spinner">
						<ProgressSpinner />

					</div>
				)
				: null
			}

			<div className="search-bar-layout-content odk-page">
				<Fieldset className="fieldset-odk" legend="Crop Model Transformer">
					<p>The service is used to transform data following the AgMIP Crop Experiment (ACE)
						format into formats adopted by the widely used DSSAT and APSIM models.
					</p>
					<p>It accepts as input JSON files having the structure defined by ACE.</p>
					<p>If you have your data as a ACE JSON file, you can directly feed them to the service.</p>
					<p>
						If you have your data as an ACEB binary file,
						you will first need to unzip the file (depending on your zip management tools,
						you may have to change the extension of your file from .aceb to .zip)
						to retrieve the corresponding JSON file and feed it to the transformer.
					</p>
					<p>
						To build ACEB data from different types, you can use the relevant tool provided by AgMIP:
						<p>
							<a href="http://tools.agmip.org/acebviewer.php">ACEB Viewer</a>
						</p>
					</p>

					<p>
						<span className="select-output p-mr-4">Select Output Model:</span>

						<Dropdown
							value={selectedModel}
							onChange={(e) => setSelectedModel(e.value)}
							options={models}
							optionLabel="name"
							placeholder="Select a Model"
							className="w-full md:w-14rem"
						/>
					</p>

					<Toast ref={toast} />

					<div className="uploader-container" hidden={checked}>
						<h4>Please upload your ACEB file</h4>
						<div style={{ width: '10%' }}>
							{
								!downloadLink
									? <Button icon="fa-solid fa-arrow-progress" label="Transform file" loading={loading} onClick={handleTransform} disabled={completedUploads.length === 0} />
									: <Button icon="fa-solid fa-download" label="Download" loading={loading} onClick={handleDownload} />
							}
						</div>

						{/* <FileUpload */}
						{/*	name="demo[]" */}
						{/*	maxFileSize={50000000} */}
						{/*	uploadHandler={onBasicUpload} */}
						{/*	customUpload */}
						{/*	ref={fileUploadRef} */}
						{/*	auto */}
						{/*	itemTemplate={itemTemplateSimple} */}
						{/*	onSelect={onSimpleTemplateSelect} */}
						{/*	onError={onSimpleTemplateClear} */}
						{/*	onClear={onSimpleTemplateClear} */}
						{/*	headerTemplate={headerSimpleTemplate} */}
						{/*	accept=".json" */}
						{/*	chooseLabel={'Crop Data'} */}
						{/*	emptyTemplate={( */}
						{/*		<p className="m-0">Add or Drag & Drop your ACEB data file(s) to */}
						{/*			retrieve files ready for the model of your choice. */}
						{/*		</p> */}
						{/*	)} */}
						{/* /> */}
						<UploadComponent completedUploads={completedUploads} setCompletedUploads={setCompletedUploads} devUrl={process.env.REACT_APP_BACKEND_URL} uppyType="dashboard" accessToken={location.state.token} restrictions={{ maxNumberOfFiles: 1, allowedFileTypes: ['.json'] }} />
					</div>

				</Fieldset>

			</div>

		</div>

	);
};

export default CropModel;
