import { faArrowLeftLong, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChatNavigationComponent(props: any) {
  return (
    <nav className="chat-navigation">
                <div className='back-arrow-container'>
                    <FontAwesomeIcon 
                        className='back-arrow'
                        icon={faArrowLeftLong} 
                        onClick={() => props.router.back()} 
                    />
                </div>
                

                <div className="userInfoContainer">
                    <FontAwesomeIcon className='active-status'icon={faCircle} />
                    <span className="username">{props.receiverUsername}</span>
                </div>
            </nav>
  )
}
