const React = require('react');

const CompLibrary = require('../core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

class Index extends React.Component {
  render() {
    return (
      <div>
        <Block layout="threeColumn">
          {[
            {},
            {
              title: `[Simple list](${pageUrl('demo-simple-list.html')})`,
            },
            {},
          ]}
        </Block>
        <Block layout="threeColumn">
          {[
            {},
            {
              title: `[Window scroller](${pageUrl('demo-window-as-scroller.html')})`,
            },
            {},
          ]}
        </Block>
      </div>
    );
  }
}

module.exports = Index;
