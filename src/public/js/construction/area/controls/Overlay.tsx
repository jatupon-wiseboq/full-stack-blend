import {HTMLHelper} from '../../helpers/HTMLHelper';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper';
import {BACKEND_CONNECTION_GROUPS, BACKEND_CONNECTION_ENTITIES} from '../../Constants';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
  enabled: boolean;
  lines: any;
  circles: any;
}

class Overlay extends React.Component<Props, State> {
    state: State = {enabled: false, lines: [], circles: []};
    static defaultProps: Props = {
    }
    
	  private domElement: HTMLElement = null;  
    
    constructor() {
      super();
    }

    public getDOMNode() {
      return this.domElement;
    }
    public setDOMNode(element: HTMLElement) {
      this.domElement = element;
    }
    public setEnable(enabled: boolean) {
      this.setState({
        enabled: enabled
      });
      
      if (enabled) {
        if (!this.domElement.parentNode) {
          document.body.appendChild(this.domElement);
        }
      } else {
        if (this.domElement.parentNode) {
          this.domElement.parentNode.removeChild(this.domElement);
        }
      }
    }
    public renderAllRelations() {
    	this._renderAllRelations();
    	window.setTimeout((() => {
    		this._renderAllRelations();
    	}).bind(this), 1000);
    }
    private _renderAllRelations() {
      if (!this.state.enabled) return;
      
      let connections = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'Connection');
      let lines = [];
      let circles = [];
      
      for (let connection of connections) {
        let source = this.getColumnOfRelation(HTMLHelper.getAttribute(connection, 'data-source-group-name'), HTMLHelper.getAttribute(connection, 'data-source-entity-name'));
        let target = this.getColumnOfRelation(HTMLHelper.getAttribute(connection, 'data-target-group-name'), HTMLHelper.getAttribute(connection, 'data-target-entity-name'));
        let connector = connection;
        
        if (source && target) {
          let sourcePosition = HTMLHelper.getPosition(source, true, true);
          let sourceSize = HTMLHelper.getSize(source);
          let sourceCenter = [sourcePosition[0] + sourceSize[0] / 2, sourcePosition[1] + sourceSize[1] / 2];
          let targetPosition = HTMLHelper.getPosition(target, true, true);
          let targetSize = HTMLHelper.getSize(target);
          let targetCenter = [targetPosition[0] + targetSize[0] / 2, targetPosition[1] + targetSize[1] / 2];
          let connectorPosition = HTMLHelper.getPosition(connector, true, true);
          let connectorSize = HTMLHelper.getSize(connector);
          let connectorCenter = [connectorPosition[0] + connectorSize[0] / 2, connectorPosition[1] + connectorSize[1] / 2];
          
          let slots = [[connectorCenter[0] - connectorSize[0] / 2, connectorCenter[1]],
            [connectorCenter[0], connectorCenter[1] - connectorSize[1] / 2],
            [connectorCenter[0] + connectorSize[0] / 2, connectorCenter[1]],
            [connectorCenter[0], connectorCenter[1] + connectorSize[1] / 2]];
          let findClosetPointOfTheConnector = (x: number, y: number) => {
            let minimum = Number.MAX_SAFE_INTEGER;
            let foundIndex = -1;
            
            for (const [i, slot] of slots.entries()) {
              let distance = Math.sqrt(Math.pow(x - slot[0], 2) + Math.pow(y - slot[1], 2));
              if (distance < minimum) {
                minimum = distance;
                foundIndex = i;
              }
            }
            
            return slots.splice(foundIndex, 1)[0];
          };
          
          if (Math.abs(sourcePosition[0] - connectorCenter[0]) < Math.abs(sourcePosition[0] + sourceSize[0] - connectorCenter[0])) {
            circles.push({
              x1: sourcePosition[0] - 8,
              y1: sourceCenter[1]
            });
            
            let closet = findClosetPointOfTheConnector(sourcePosition[0] - 8, sourceCenter[1]);
            lines.push({
              x1: sourcePosition[0] - 8,
              y1: sourceCenter[1],
              x2: closet[0],
              y2: closet[1]
            });
          } else {
            circles.push({
              x1: sourcePosition[0] + sourceSize[0] + 8,
              y1: sourceCenter[1]
            });
            
            let closet = findClosetPointOfTheConnector(sourcePosition[0] + sourceSize[0] + 8, sourceCenter[1]);
            lines.push({
              x1: sourcePosition[0] + sourceSize[0] + 8,
              y1: sourceCenter[1],
              x2: closet[0],
              y2: closet[1]
            });
          }
          
          if (Math.abs(targetPosition[0] - connectorCenter[0]) < Math.abs(targetPosition[0] + targetSize[0] - connectorCenter[0])) {
            circles.push({
              x1: targetPosition[0] - 8,
              y1: targetCenter[1]
            });
            
            let closet = findClosetPointOfTheConnector(targetPosition[0] - 8, targetCenter[1]);
            lines.push({
              x1: targetPosition[0] - 8,
              y1: targetCenter[1],
              x2: closet[0],
              y2: closet[1]
            });
          } else {
            circles.push({
              x1: targetPosition[0] + targetSize[0] + 8,
              y1: targetCenter[1]
            });
            
            let closet = findClosetPointOfTheConnector(targetPosition[0] + targetSize[0] + 8, targetCenter[1]);
            lines.push({
              x1: targetPosition[0] + targetSize[0] + 8,
              y1: targetCenter[1],
              x2: closet[0],
              y2: closet[1]
            });
          }
        }
      }
      
      this.setState({
        lines: lines,
        circles: circles
      });
    }
    private getColumnOfRelation(groupName: string, entityName: string) {
      if (!groupName || !entityName) return null;
      
      const groups = BACKEND_CONNECTION_GROUPS;
      const entities = BACKEND_CONNECTION_ENTITIES;
      
      for (const [i, group] of groups.entries()) {
        let tables = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', group);
        for (let table of tables) {
          if (HTMLHelper.getAttribute(table, 'data-title-name') == groupName) {
            let columns = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', entities[i], table);
            for (let column of columns) {
              if (HTMLHelper.getAttribute(column, 'data-title-name') == entityName) {
                return column;
              }
            }
            break;
          }
        }
      }
      
      return null;
    }
    
    render() {
        return (
            pug `
              svg.internal-fsb-overlay.internal-fsb-accessory
                each info, index in this.state.lines
                  line(key='line-' + index, x1=info.x1, y1=info.y1, x2=info.x2, y2=info.y2, style={stroke: 'rgb(0, 123, 255)', strokeWidth: 1})
                each info, index in this.state.circles
                  circle(key='center-' + index, cx=info.x1, cy=info.y1, r=4, fill='rgb(0, 123, 255)')
            `
        )
    }
}

DeclarationHelper.declare('Controls.Overlay', Overlay);

export {Props, State, Overlay};