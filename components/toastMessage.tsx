import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ToastMessage({ message } : { message: string }) {
    return (
        <div className="fixed top-4 right-4 rounded-lg p-4 shadow-lg bg-green-400 flex items-center z-[120] gap-4">
            <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center">
                <FontAwesomeIcon icon={faCheck} className="text-green-400"/>
            </div>
            <p className="text-sm text-white font-semibold">{message}</p>
        </div>
    )
}