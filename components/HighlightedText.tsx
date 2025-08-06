import { useColorModeValue, chakra } from '@chakra-ui/react';

export const HighlightedText = ({
  text,
  query,
}: {
  text: string;
  query: string;
}) => {
  const customBG = useColorModeValue('yellow.200', 'yellow.600');
  if (!query) return <>{text}</>;

  const regex = new RegExp(`(${query})`, 'ig'); // 'i' para case-insensitive
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <chakra.span
            key={index}
            bg={customBG}
            borderRadius='sm'
            fontWeight='bold'
          >
            {part}
          </chakra.span>
        ) : (
          <chakra.span key={index}>{part}</chakra.span>
        )
      )}
    </>
  );
};
