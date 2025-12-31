// import siemensIcon from "../assets/images/";

// import hasicon from "https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png";
import techcori from "../assets/images/tech-cori.png";
import techarhrex from "../assets/images/tech-arhrex.webp";
import techleica from "../assets/images/tech-leica.webp";
import techolympus from "../assets/images/tech-olympus.webp";
import techsiemens from "../assets/images/tech-siemens.webp";
import techsiemenssomatom from "../assets/images/tech-siemens-somatom.webp";

const TechnologySection = () => {

  const technologies = [
    {
      id: 1,
      name: "Smith & Nephew – CORI Robotic System",
      icon: techcori,
      description: "Advanced imaging system"
    },
    {
      id: 2,
       name: "Arthrex Synergy Vision Imaging ",
      icon: techarhrex,
      description: "Advanced diagnostic imaging"     
    },
    {
      id: 3,
      name: "Siemens ARTIS one Edition X Cathlab",
        icon: techsiemens,      
      description: "Robotic surgical assistance"
    },
    {
      id: 4,
      name: "Siemens SOMATOM go.Now CT Scan",
      icon: techsiemenssomatom,
      description: "Advanced imaging system"     
    },
    {
      id: 5,
      name: "Olympus Endoscope",
      icon: techolympus,
      description: "Precision surgical microscope"
    },
    {
      id: 6,
      name: "Leica M520 Optics OptiChrome Microscope",
      icon: techleica,
      description: "Surgical navigation technology"
    }
  ]

  //  name: "J & J VELYS Robotic-Assidted Solutions",
  //  icon: "https://res.cloudinary.com/sdk28cdn/image/upload/v1758394661/agastya/tech-jandj.webp",
  //  description: "Healthcare information system"

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-start mb-5">
          <h2 className="main-title mb-5">Healthcare Through Advanced Technologies</h2>
        </div>
      </div>
      <div className="container">
        <div className="row">
          
            {technologies.map((tech) => (
              <div className="col-lg-4">
              <div
                key={tech.id}
                className="technology-card"
              >
                <div className="technology-icon"><img src={tech.icon} alt={tech.name} width="80" /></div>
                {/* <div className="technology-icon"><img src={'https://placehold.co/100x100/EEE/31343C'} /></div> */}
                
                <h3 className="technology-name">{tech.name}</h3>
                {/* <p className="text-xs text-gray-600">{tech.description}</p> */}
              </div>
               </div>
            ))}
         
        </div>

        {/* <div className="text-center">
          <p className="text-gray-600 text-lg">
            State-of-the-Art Equipment • Technological Excellence • Precision-Driven Tools
          </p>
        </div> */}

 
 


      </div>
      
        <div className="marquee-section section-padding pt-0">
            <div className="mycustom-marque theme-blue-bg">
                <div className="scrolling-wrap">
                    <div className="comm">
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />Technological Excellence</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />Precision Driven Tools</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />State-of-the-Art Equipment&nbsp;&nbsp;</div>
                    </div>
                    <div className="comm">
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />Technological Excellence</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />Precision Driven Tools</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />State-of-the-Art Equipment &nbsp;&nbsp;</div>
                    </div>
                   <div className="comm">
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />Technological Excellence</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />Precision Driven Tools</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />State-of-the-Art Equipment&nbsp;&nbsp;</div>
                    </div>
                     <div className="comm">
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />Technological Excellence</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />Precision Driven Tools</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://res.cloudinary.com/sdk28cdn/image/upload/v1767202076/agastya/has.png'} alt="img" />State-of-the-Art Equipment&nbsp;&nbsp;</div>
                    </div>
                    
                </div>
            </div>
        </div>
    </section>
  )
}

export default TechnologySection 