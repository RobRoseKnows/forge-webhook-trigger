import ForgeUI, { render, Fragment, Macro, Text } from "@forge/ui";

const App = () => {
  return (
    <Fragment>
      <Text>Hello world!</Text>
    </Fragment>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);
