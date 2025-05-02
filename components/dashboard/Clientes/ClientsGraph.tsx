import GraphLayoutManagerClient from '../GraphLayoutManagerClient';
import ClientsGraphComp from './ClientsGraphComp';

const ClientsGraph = () => {
  return (
    <GraphLayoutManagerClient>
      <ClientsGraphComp />
    </GraphLayoutManagerClient>
  );
};

export default ClientsGraph;
