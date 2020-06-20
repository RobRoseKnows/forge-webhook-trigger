import ForgeUI, { render, Fragment, Macro, Text, ConfigForm, TextField, useConfig, useState, TextArea } from "@forge/ui";

const STATE = {
  INITIAL: 0,
  SUCCESS: 1
};

async function doWebhook(url, method, mode, )

const Config = () => {

  return (
    <ConfigForm>
      <TextField 
        label="Button Text"
        name="buttonText"
        defaultValue="Trigger Webhook" />
      <TextField
        label="Webhook URL"
        name="webhookURL"
        placeholder="https://httpbin.org/get"
        isRequired={true} />
      <TextArea
        label="Webhook Body"
        name="webhookBody"
        isMonospaced={true} />
      <Select 
        label="Webhook Method"
        name="webhookMethod">
        <Option defaultSelected label="GET" value="GET" />
        <Option label="PUT" value="PUT" />
        <Option label="POST" value="POST" />
        <Option label="DELETE" value="DELETE" />
      </Select>
      <Select 
        label="Webhook Mode"
        name="webhookMode">
        <Option defaultSelected label="cors" value="cors" />
        <Option label="no-cors" value="no-cors" />
        <Option label="same-origin" value="same-origin" />
      </Select>
      <TextArea
        label="Webhook Headers"
        name="webhookHeaders"
        isMonospaced={true}
        defaultValue="{'Content-Type': 'application/json'}" />
    </ConfigForm>
  )
}

const App = () => {
  const config = useConfig();
  const [ state, setState ] = useState(STATE.INITIAL);
  const [ error, setError ] = useState(null);

  if (!config) {
    return doNeedConfig();
  }

  switch(state) {
    case STATE.INITIAL:
      return doInitial();
    case STATE.SUCCESS:
  }

  return (
    <Fragment>
      <Text>Hello world!</Text>
    </Fragment>
  );
};

export const run = render(<Macro app={<App />} config={<Config />}/>);
