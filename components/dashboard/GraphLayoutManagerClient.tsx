import { useClientsGraph } from '@/context/useClientsGraphContext';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Select,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
const GraphLayoutManagerClient = ({ children }: { children: ReactNode }) => {
  const { update, loading, lapso, setDiario, setLapso, date, setDate } =
    useClientsGraph();
  const LapseOptions = ['Diario', 'Mensual'];
  return (
    <Flex gap={2} w='100%' flexDir='column'>
      <Flex gap={3}>
        <Button
          w='fit-content'
          size='sm'
          bg='gray.600'
          color='white'
          _hover={{ opacity: 0.75 }}
          onClick={update}
          isLoading={loading}
        >
          Actualizar
        </Button>
        <Select
          cursor='pointer'
          w='fit-content'
          size='sm'
          borderColor='gray'
          value={lapso}
          onChange={(e) => {
            const { value } = e.target;
            setLapso(value);
            if(value === "Diario"){
              setDiario(true);
            }
          }}
          borderRadius={5}
        >
          {LapseOptions.map((o) => {
            return <option key={o}>{o}</option>;
          })}
        </Select>
        {lapso === 'Diario' && (
          <Menu isLazy>
            <MenuButton
              as={Button}
              bg='gray.700'
              color='white'
              _hover={{ opacity: 0.7 }}
              w='fit-content'
              alignSelf='center'
              size='sm'
            >
              Elegir Fecha
            </MenuButton>
            <MenuList boxShadow='0 0 5px'>
              {/* MenuItems are not rendered unless Menu is open */}

              <DayPicker
                mode='single'
                required
                selected={date}
                onSelect={setDate} // Maneja el estado
                captionLayout='dropdown'
                disabled={{
                  before: new Date('2025-02-18'),
                  after: new Date(),
                }}
              />
            </MenuList>
          </Menu>
        )}
      </Flex>
      {children}
    </Flex>
  );
};

export default GraphLayoutManagerClient;
