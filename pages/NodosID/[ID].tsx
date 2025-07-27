import NodoCardID from '@/components/nodos/NodoCardID';
import NotFoundPage from '@/components/NotFoundPage';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { NodoType } from '@/types/types';
type ServerSideProps = {
  params: {
    ID: string;
  };
};
export const getServerSideProps = async ({ params }: ServerSideProps) => {
  const { ID } = params;
  const nodo = (await getSingleDoc('nodos', ID)) as NodoType;
  if (!nodo) {
    return {
      props: {
        nodo: null,
      },
    };
  }
  return {
    props: {
      nodo,
    },
  };
};

const MovimientoID = ({ nodo }: { nodo: NodoType | null }) => {
  if (!nodo)
    return (
      <NotFoundPage
        content='El nodo que buscás no existe o fue eliminado.'
        title='Nodo no encontrado'
      />
    );
  return <NodoCardID initialNodo={nodo} />;
};

export default MovimientoID;
