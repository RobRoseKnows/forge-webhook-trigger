import ForgeUI, { render, Fragment, Macro, Text, ConfigForm, TextField, useConfig, useState, TextArea, Select, Option, Button } from "@forge/ui";
import fetch from 'node-fetch';

const STATE = {
  INITIAL: 0,
  SUCCESS: 1
};

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
  const [ response, setResponse ] = useState(null);
  
  const doWebhook = async (url, method, mode, cache, credentials, headers, redirect, referrerPolicy, body) => {
    const response = await fetch(url, {
      method: method,
      mode: mode,
      cache: cache,
      credentials: credentials,
      headers: headers,
      redirect: redirect,
      referrerPolicy: referrerPolicy,
      body: body
    });
    
    console.log(response.text());
  
    if(!response.ok) {
      throw new Error("Error: Webhook response not ok.");
    }
  
    return response.text();
  }

  const doNeedConfig = () => {
    return (
      <Fragment>
        <Text>**Webhook Macro for Confluence** requires configuration before use.</Text>
      </Fragment>
    );
  };

  const doInitial = () => {
    return (
      <Fragment>
        <Button 
          text={config.buttonText}
          onClick={() => {
            setError(null);
            setResponse(null);
            doWebhook(
              config.webhookURL,
              config.webhookMethod,
              config.webhookMode,
              config.webhookCache,
              config.webhookCredentials,
              config.webhookHeaders,
              config.webhookRedirect,
              config.webhookReferrerPolicy,
              config.webhookBody).then(response => {
                setState(STATE.SUCCESS);
                setResponse(response);
                console.log("Webhook responded.")
              }).catch(error => {
                setState(STATE.SUCCESS);
                setError(error);
                console.error("Error: Webhook response not ok.", error);
              });
          }} 
        />
      </Fragment>
    )
  };

  const doSuccess = () => {
    if (error) {
      return (
        <Fragment>
          <Text>**Webhook Errored!** Response:</Text>
          <Text>{error}</Text>
          <Button 
            text="Reset" 
            onClick={() => {
                setState(STATE.INITIAL);
                setError(null);
                setResponse(null);
              }}
          />
        </Fragment>
      )
    }

    return (
      <Fragment>
        <Text>**Webhook Successful!** Response:</Text>
        <Text>{response}</Text>
        <Button 
          text="Reset" 
          onClick={() => {
              setState(STATE.INITIAL);
              setError(null);
              setResponse(null);
            }}
        />
      </Fragment>
    );
  };

  if (!config) {
    return doNeedConfig();
  }

  switch(state) {
    case STATE.INITIAL:
      return doInitial();
    case STATE.SUCCESS:
      return doSuccess();
  }
};

export const run = render(<Macro app={<App />} config={<Config />}/>);
