import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import './styles.css';
import { Button } from 'primereact/button';

const ApiCodeGenerator = (props) => {
	const { datapool, requestBody, requestConfiguration } = props;

	const [snippetCode, setSnippetCode] = useState(null);
	const [code_lang, setCodeLang] = useState(null);
	const [codegen, setCodegen] = useState(null);
	const [languageTabIndex, setLanguageTabIndex] = useState(0);
	const [languages, setLanguages] = useState([]);
	const [selectedLanguage, setSelectedLanguage] = useState('C#');
	const [variantTabIndex, setVariantTabIndex] = useState(0);

	useEffect(() => {
		// Polyfill for Buffer
		// eslint-disable-next-line global-require
		global.Buffer = global.Buffer || require('buffer').Buffer;
		global.process = { env: {} };

		// Import postman-code-generators after the polyfill
		import('postman-code-generators/lib')
			.then((cg) => {
				setCodegen(cg);
				let lang = cg.getLanguageList();
				const R = lang.find((item) => item.label === 'R');
				const python = lang.find((item) => item.label === 'Python');
				lang = lang.filter((item) => item.label !== 'R' && item.label !== 'Python');
				lang = [R, python, ...lang];
				setLanguages(lang);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const generateCodeSnippet = (languageLabel, variant) => {
		// eslint-disable-next-line global-require,import/no-extraneous-dependencies
		const sdk = require('postman-collection'); // require postman-collection in your project

		const body = new sdk.RequestBody(requestBody);

		const request = new sdk.Request({
			...requestConfiguration,
			body,
		});
		const languageObject = languages.find((item) => item.label === languageLabel);
		const language = languageObject.key;
		const selectedVariant = languageObject.variants[variant].key;

		const options = {
			indentCount: 3,
			indentType: 'Space',
			trimRequestBody: true,
			followRedirect: true,
		};

		codegen.convert(language, selectedVariant, request, options, (error, snippet) => {
			if (error) {
				console.log(error);
			} else {
				setSnippetCode(snippet);
			}
		});
	};

	useEffect(
		() => {
			if (languages.length) {
				generateCodeSnippet(selectedLanguage, variantTabIndex);
			}
		}, [selectedLanguage, variantTabIndex, languages]
	);

	const renderCodeSnippet = () => {
		if (snippetCode) {
			const temp = snippetCode.replaceAll('\\', '');
			let snippetParts = temp.split('\n');

			snippetParts = snippetParts.map((item) => {
				return <p>{item}</p>;
			});

			snippetParts = [<Button text rounded icon="fa-solid fa-copy" onClick={() => navigator.clipboard.writeText(temp)} />, ...snippetParts];
			return snippetParts;
		}
		return null;
	};

	const renderSubTabs = (variants) => {
		const renderVariants = () => {
			return variants.map((item) => {
				return (
					<TabPanel header={item.key}>
						<div className="code-snippet">
							{renderCodeSnippet()}
						</div>
					</TabPanel>
				);
			});
		};

		if (variants.length > 1) {
			return (
				<div className="code-generator">
					<TabView
						activeIndex={variantTabIndex}
						onTabChange={(e) => {
							// generateCodeSnippet(selectedLanguage, e.index);
							setVariantTabIndex(e.index);
						}}
					>
						{renderVariants()}
					</TabView>
				</div>
			);
		}
		return (
			<div className="code-snippet">
				{renderCodeSnippet()}
			</div>
		);
	};

	const renderTabs = () => {
		if (codegen && languages) {
			return languages.map((item) => {
				return (
					<TabPanel header={item.label}>
						{renderSubTabs(item.variants)}
					</TabPanel>
				);
			});
		}
		return null;
	};

	return (
		<div className="code-generator">
			<h4>Datapool ID: {datapool}</h4>
			<TabView
				scrollable
				activeIndex={languageTabIndex}
				onTabChange={(e) => {
					setSelectedLanguage(e.originalEvent.target.innerText);
					setVariantTabIndex(0);
					setLanguageTabIndex(e.index);
				}}
			>
				{renderTabs()}
			</TabView>
		</div>
	);
};

export default ApiCodeGenerator;
