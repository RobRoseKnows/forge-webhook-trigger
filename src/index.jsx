import ForgeUI, { render, Fragment, Macro, Text, ConfigForm, TextField, useConfig, useState, TextArea, Select, Option, Button } from "@forge/ui";
import api from "@forge/api";

const {DEBUG_LOGGING} = process.env;

const Config = () => {

  return (
    <ConfigForm>
      <TextField 
        label="Button Text"
        name="buttonText"
        defaultValue="Trigger Webhook"
        isRequired={true} />
      <TextField
        label="Webhook URL"
        name="webhookURL"
        placeholder="https://httpbin.org/get"
        isRequired={true} />
      <TextArea
        label="Webhook Body (only JSON supported)"
        name="webhookBody"
        isMonospaced={true}
        placeholder="{}" />
      <Select 
        label="Webhook Method"
        name="webhookMethod">
        <Option defaultSelected label="GET" value="GET" />
        <Option label="PUT" value="PUT" />
        <Option label="POST" value="POST" />
        <Option label="DELETE" value="DELETE" />
      </Select>
      {/* <Select 
        label="Webhook Mode"
        name="webhookMode">
        <Option defaultSelected label="cors" value="cors" />
        <Option label="no-cors" value="no-cors" />
        <Option label="same-origin" value="same-origin" />
      </Select>
      <Select
        label="Webhook Cache Settings"
        name="webhookCache">
        <Option defaultSelected label="default" value="default" />
        <Option label="no-cache" value="no-cache" />
        <Option label="reload" value="reload" />
        <Option label="force-cache" value="force-cache" />
        <Option label="only-if-cached" value="only-if-cached" />
      </Select>
      <Select
        label="Webhook Credentials Settings"
        name="webhookCredentials">
        <Option defaultSelected label="same-origin" value="same-origin"/>
        <Option label="include" value="include"/>
        <Option label="omit" value="omit"/>
      </Select> */}
      <TextArea
        label="Webhook Headers"
        name="webhookHeaders"
        isMonospaced={true}
        defaultValue='{"Content-Type": "application/json"}' />
    </ConfigForm>
  )
}

const App = () => {
  const config = useConfig();
  const [ response, setResponse ] = useState(null);

  async function doWebhook(url, opts) {
    const fetchResponse = await api.fetch(url, opts);
    await checkResponse(fetchResponse);
    const text = JSON.stringify(await fetchResponse.json());
    setResponse(text);
  }

  const doNeedConfig = () => {
    return (
      <Fragment>
        <Text>**Webhook Macro for Confluence** requires configuration before use.</Text>
      </Fragment>
    );
  };

  if (!config) {
    return doNeedConfig();
  }

  return (
    <Fragment>
      <Button 
        text={config.buttonText}
        onClick={async () => {await doWebhook(config.webhookURL, {
          method: config.webhookMethod,
          headers: JSON.parse(config.webhookHeaders),
          body: JSON.stringify(config.webhookBody)
        }); }} />
        {response && (
          <Fragment>
            <Text>**Webhook Successful!**</Text>
            <Text>```{response}```</Text>
          </Fragment>
        )}
    </Fragment>
  );
};

async function checkResponse(response) {
  if (!response.ok) {
    const message = `Error from webhook: ${response.status} ${await response.text()}`;
    console.error(message);
    throw new Error(message);
  } else if (DEBUG_LOGGING) {
    console.debug(`Response from webhook: ${await response.text()}`);
  }
}

export const run = render(<Macro app={<App />} config={<Config />}/>);
