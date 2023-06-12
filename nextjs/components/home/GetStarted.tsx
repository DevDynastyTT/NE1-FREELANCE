'use client'

import Man from '../../public/images/man.png'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
function GetStarted() {
    const router = useRouter()
    return (
        <div className="getStarted">
        
        <div className="signup-cta">
            <h5>Unlock your business's <i>potential</i> <br/> 
                with the right talent!</h5>
                <br/>
            <button className="getStarted-btn" title="get started button"
                onClick={()=> router.push("/members/signup")}>Get Started
            </button>
        </div>

        <div className="image">
            <Image 
                src={Man} 
                alt="Black guy in white jersey excited"/>
        </div>
    
</div>
    )
}

export default GetStarted;