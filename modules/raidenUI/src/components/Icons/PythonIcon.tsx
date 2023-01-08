import PythonSVG from "../../assets/python.svg"
import Icon, { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const PythonIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={ 
        ()=><img style={{height:'100%', width:'100%'}}  src={PythonSVG} ></img>
    } {...props} />
);

export default PythonIcon