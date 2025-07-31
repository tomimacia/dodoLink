import ServicioIDPage from '@/components/servicios/ServicioIDPage';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { ServicioFirebaseType } from '@/types/types';
import axios from 'axios';

type ServerSideProps = {
  params: {
    ID: string;
  };
};

export const getServerSideProps = async ({ params }: ServerSideProps) => {
  const { ID } = params;

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_CURRENT_URL}api/sqlDB/productID?id=${ID}`
    );
    const producto = res.data || null;

    let graphImage: string[] = [];
    let graphId: string[] = [];

    const findProductoFirebase = (await getSingleDoc('servicios', ID)) as
      | ServicioFirebaseType
      | undefined;

    if (findProductoFirebase) {
      graphId = findProductoFirebase.graphId || [];
    } else {
      const newProducto = { id: ID, graphId: [] };
      await setSingleDoc('servicios', ID, newProducto);
    }

    if (graphId.length > 0) {
      try {
        const graphResponses = await Promise.all(
          graphId.map((g) =>
            axios.post(
              `${process.env.NEXT_PUBLIC_CURRENT_URL}api/zabbix/graph`,
              { graphid: g }
            )
          )
        );

        graphImage = graphResponses.map((res) => res.data.imageBase64 || '');
      } catch (err: any) {
        console.error('Error al traer gráficos de Zabbix:', err.message);
      }
    }

    return {
      props: {
        producto,
        graphImage,
        productoFirebase: findProductoFirebase || { id: ID, graphId: [] },
      },
    };
  } catch (error) {
    console.error('Error al traer el producto:', error);
    return {
      props: {
        producto: null,
        graphImage: [],
        productoFirebase: { id: params.ID, graphId: [] },
      },
    };
  }
};

const ServicioID = ({
  producto,
  graphImage,
  productoFirebase,
}: {
  producto: any;
  graphImage: string[];
  productoFirebase: ServicioFirebaseType;
}) => {
  return (
    <ServicioIDPage
      producto={producto}
      graphImage={graphImage}
      productoFirebase={productoFirebase}
    />
  );
};

export default ServicioID;
