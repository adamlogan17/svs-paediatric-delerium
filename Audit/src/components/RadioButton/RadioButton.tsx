import Form from 'react-bootstrap/Form';

interface RadioProps {
  options: string[];
  onSelect: (option: string) => void;
  selectedOption: string | null;
}

const RadioButton: React.FC<RadioProps> = ({ options, onSelect, selectedOption }) => {

  const handleSelect = (option: string) => {
    onSelect(option);
  };

  return (
    <Form>
      {options.map((option) => (
        <Form.Check
          key={option}
          type="radio"
          id={option}
          label={option}
          value={option}
          checked={selectedOption === option}
          onChange={() => handleSelect(option)}
        />
      ))}
    </Form>
  );
};

export default RadioButton;
