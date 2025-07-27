import ServicioIDPage from '@/components/servicios/ServicioIDPage';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import axios from 'axios';
type ServerSideProps = {
  params: {
    ID: string;
  };
};

type ProductoFirebaseType = {
  id: string;
  graphId: string | null;
  description?: string[];
};

export const getServerSideProps = async ({ params }: ServerSideProps) => {
  const { ID } = params;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_CURRENT_URL}api/sqlDB/productID?id=${ID}`
    );
    const producto = res.data || null;

    let graphImage = null;
    let graphId = null;

    const findProductoFirebase = (await getSingleDoc('servicios', ID)) as
      | ProductoFirebaseType
      | undefined;

    if (findProductoFirebase) {
      graphId = findProductoFirebase.graphId;
    } else {
      const newProducto = { id: ID, graphId: null };
      await setSingleDoc('servicios', ID, newProducto);
    }

    if (graphId) {
      try {
        const graphRes = await axios.post(
          `${process.env.NEXT_PUBLIC_CURRENT_URL}api/zabbix/graph`,
          { graphid: graphId }
        );
        graphImage = graphRes.data.imageBase64 || null;
      } catch (err: any) {
        console.error('Error al traer gráfico de Zabbix:', err.message);
      }
    }

    return {
      props: {
        producto,
        graphImage,
        productoFirebase: findProductoFirebase || { id: ID, graphId: null },
      },
    };
  } catch (error) {
    console.error('Error al traer el producto:', error);
    return {
      props: {
        producto: null,
        graphImage: null,
        productoFirebase: null,
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
  graphImage: string | null;
  productoFirebase: ProductoFirebaseType;
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
