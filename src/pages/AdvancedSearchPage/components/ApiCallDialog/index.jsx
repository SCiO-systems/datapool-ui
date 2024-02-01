import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ApiCodeGenerator } from '../../../../components';

const ApiCallDialog = (props) => {
	const { visible, setVisible, selectedDatapool, api, elasticQuery } = props;

	const json = JSON.parse(elasticQuery);
	const query = JSON.parse(json.query);

	return (
		<Dialog header="API Call" visible={visible} style={{ width: '90vw', height: '90vh' }} onHide={() => setVisible(false)}>
			<div>
				<Accordion>
					<AccordionTab header="Token Generation">
						<ApiCodeGenerator
							datapool={selectedDatapool.metadata?.mongo_id}
							requestBody={{
								mode: 'raw',
								raw: JSON.stringify({
									client_id: api.auth_zero_id,
									client_secret: api.secret,
									audience: 'https://datapool.scio.services',
									grant_type: 'client_credentials',
								}),
							}}
							requestConfiguration={{
								url: 'https://sciosystems.eu.auth0.com/oauth/token',
								method: 'POST',
								header: 'content-type: application/json',
							}}
						/>
					</AccordionTab>
					<AccordionTab header="Api Call">
						<ApiCodeGenerator
							datapool={selectedDatapool.metadata?.mongo_id}
							requestBody={{
								mode: 'raw',
								raw: JSON.stringify(query),
							}}
							requestConfiguration={{
								url: `${process.env.REACT_APP_BACKEND_URL}/api/datapools/public/${selectedDatapool.metadata?.mongo_id}/documents/{from}/{to}`,
								method: 'POST',
								header: 'authorization: Bearer "Your token"',
							}}
						/>
					</AccordionTab>
				</Accordion>
			</div>
		</Dialog>
	);
};

export default ApiCallDialog;
