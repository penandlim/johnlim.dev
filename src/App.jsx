import React from 'react';

// Create a ES6 class component
class Title extends React.Component {
// Use the render function to return JSX component
    render() {
        return (
            <div className="workTitle something">
                <h1>{this.props.title}</h1>
            </div>
        );
    }
}

class PreviewYoutube extends React.Component {
// Use the render function to return JSX component
    render() {
        return (
            <iframe width="480" height="270" src={this.props.previewSrc}
                    style={{display: "inline"}} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
            </iframe>
        );
    }
}

class Preview extends React.Component {
// Use the render function to return JSX component
    render() {
        var previewContent;
        if (this.props.type === "youtube") {
            previewContent = <PreviewYoutube previewSrc={this.props.previewSrc} />;
        }

        return (
            <div className="preview something">
                {previewContent}
            </div>
        );
    }
}

class Keyword extends React.Component {
    render() {
        return (
            <span><span className={"keyword " + this.props.keywordType}>{this.props.keyword}</span> </span>
        );
    }
}

class Description extends React.Component {
// Use the render function to return JSX component
    render() {
        const keywords = this.props.keywords.map((keyword) => <Keyword keywordType={keyword.type} keyword={keyword.keyword} key={keyword.keyword}/>);

        return (
            <div className="something description">
                <div className="descriptionText something">{this.props.descriptionText}</div>
                <div className="keywordsText something">
                    {keywords}
                </div>
            </div>
        );
    }
}

class Link extends React.Component {
    render() {
        return(
            <a href={this.props.url} target="_blank">
                <i className={this.props.fa  + " fa-2x"}/>
            </a>
        );
    }
}

class Links extends React.Component {
    render() {

        var links = [];
        if (!(this.props.links.direct == null)) {
            links.push(<Link key={this.props.links.direct} url={this.props.links.direct} fa="fas fa-external-link-alt" />);
        }
        if (!(this.props.links.github == null)) {
            links.push(<Link key={this.props.links.github} url={this.props.links.github} fa="fab fa-github" />);
        }

        return(
            <div className="links">
                {links}
            </div>
        );
    }
}


class WorkContainer extends React.Component {
// Use the render function to return JSX component
    render() {
        return (
            <div className="workContainer w-100 something">
                <Title title={this.props.json.title}/>
                <Preview type={this.props.json.previewType} previewSrc={this.props.json.previewSrc} />
                <Description descriptionText={this.props.json.descriptionText} keywords={this.props.json.keywords}/>
                <Links links={this.props.json.links}/>
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        const works = this.props.parsedJsonData.map((json) => <WorkContainer json={json} key={json.title} />);

        return(
            <div>
                {works}
            </div>
        );
    }
}

export default App;