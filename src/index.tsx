import * as React from 'react'
import * as debounce from 'lodash.debounce'
import Events from './events/index'
import Event from "./models/event"
// import {addTop} from "./utils/event"
import Sparkline from './sparkline'
import Domain, { DomainType, IDomainDef } from './models/domain'
// import Dev from "./dev"
// import Rulers from './rulers/index'
// import Indicator from './indicator'



const Container = (props) =>
	<div
		ref={props.setRef}
		style={{
			backgroundColor: 'white',
			boxSizing: 'border-box',
			height: '100%',
			overflow: 'hidden',
			position: 'relative',
			width: '100%',
			...props.style
		}}
	>
		{props.children}	
	</div>

export interface IRawEvent {
	date: Date,
	title: string
}

export interface IAggregate {
	count: number
	year: number
}

export interface ITimelineProps {
	aggregate?: IAggregate[]
	async?: boolean
	children?: React.ReactNode
	domainCenter?: number // Between 0 and 1. 0 = left, .5 = centered, 1 = right
	domainRatio?: number // Between 0 and 1. 0 = no visible domain, 1 = whole domain visible
	domains: IDomainDef[]
	events?: IRawEvent[]
	from: Date,
	load?: (from: Date, to: Date) => void
	style?: React.CSSProperties
	to: Date,
}
export interface ITimelineState {
	domain: Domain
	domains: Domain[]
	domainCenter: number
	domainRatio: number
	events: Event[]
	visibleDomain: Domain
}
class Timeline extends React.Component<ITimelineProps, ITimelineState> {
	static defaultProps: Partial<ITimelineProps> = {
		async: false,
		domainCenter: .5,
		domainRatio: 1,
	}

	private el: Element

	public state: ITimelineState = {
		domains: [],
		domain: null,
		domainCenter: this.props.domainCenter,
		domainRatio: this.props.domainRatio,
		events: [],
		visibleDomain: null,
	};

	public componentDidMount() {
		this.init2(this.props)
		window.addEventListener('resize', this.debouncedHandleResize)
	}

	public componentWillReceiveProps(nextProps) {
		if (
			this.props.from !== nextProps.from ||
			this.props.to !== nextProps.to
		) {
			this.init2(nextProps)
		}
		// if (nextProps.hasOwnProperty('events')) {
		// 	const events = addTop(nextProps.events.map(e => new Event(e, this.state.visibleDomain)))
		// 	this.setState({ events })
		// }
	}

	public componentWillUnmount() {
		window.removeEventListener('resize', this.debouncedHandleResize)
	}

	public render() {
		return (
			<Container
				setRef={(el) => { this.el = el }}
				style={this.props.style}
			>
				{
					this.state.domains.length &&
					<div style={{ width: '100%', height: '100%' }}>
						{
							this.state.domains
								.map(d => this.domainComponents(d))
						}
					</div>
				}
			</Container>
		)
	}

	public domainComponents(domain: Domain) {
		// Extend domain definition with default values

		switch (domain.type) {
			case DomainType.Sparkline: {
				return (
					<Sparkline
						aggregate={this.props.aggregate}
						domain={domain}
						key="sparkline"
					/>
				)
			}

			case DomainType.Event: {
				return (
					<Events
						events={this.state.events}
						key="events"
					/>
				)
			}
		}
	}

	private init2 = (props) => {
		const width = this.el.getBoundingClientRect().width
		const height = this.el.getBoundingClientRect().height

		this.setState({
			domains: props.domains.map(d =>
				new Domain(props.from, props.to, width, height, d)
			)
		})
	}

	// private init = () => {
	// 	const width = this.el.getBoundingClientRect().width
	// 	const height = this.el.getBoundingClientRect().height
	// 	const domain = new Domain(this.props.from, this.props.to, width, height)
	// 	const visibleDomain = this.getVisibleDomain(domain, this.state.domainCenter, this.state.domainRatio)
	// 	const events = this.props.events != null ?
	// 		addTop(this.props.events.map(e => new Event(e, visibleDomain))) :
	// 		null

	// 	this.setState({ events, domain, visibleDomain })

	// 	if (this.props.load != null) {
	// 		this.props.load(visibleDomain.from, visibleDomain.to)
	// 	}
	// }

	// private getVisibleDomain(domain: Domain, domainCenter: number, domainRatio: number): Domain {
	// 	// ----- leftRatio --- visibleDomainCenter --- rightRatio -----
	// 	// The area between leftRatio and rightRatio === this.props.visibleDomainRatio
	// 	// Center point between leftRatio and rightRatio === this.props.visibleDomainCenter

	// 	const leftRatio = domainCenter - (domainRatio/2) 
	// 	const rightRatio = domainCenter + (domainRatio/2) 
	// 	const from = domain.dateAtProportion(leftRatio)
	// 	const to = domain.dateAtProportion(rightRatio)

	// 	return new Domain(from, to, domain.width, domain.height)
	// }

	private debouncedHandleResize = debounce(this.init2, 200)
}

export default Timeline
export { DomainType } from './models/domain'

						// <Rulers
						// 	domain={this.state.domain}
						// 	domainRatio={this.state.domainRatio}
						// 	visibleDomain={this.state.visibleDomain}
						// />
						// <Indicator
						// 	left={this.state.domain.positionAtDate(this.state.visibleDomain.from)}
						// 	onClick={(x) => {
						// 		const domainCenter = this.state.domain.proportionAtPosition(x)
						// 		const visibleDomain = this.getVisibleDomain(this.state.domain, domainCenter, this.state.domainRatio)
						// 		this.setState({ visibleDomain, domainCenter })
						// 		this.props.load(visibleDomain.from, visibleDomain.to)
						// 	}}
						// 	onMove={(left) => {
						// 		const domainCenter = this.state.domain.proportionAtPosition(left) + (this.state.domainRatio/2)
						// 		const visibleDomain = this.getVisibleDomain(this.state.domain, domainCenter, this.state.domainRatio)
						// 		this.setState({ visibleDomain, domainCenter })
						// 		this.props.load(visibleDomain.from, visibleDomain.to)
						// 	}}
						// 	width={this.state.domain.positionAtDate(this.state.visibleDomain.to) - this.state.domain.positionAtDate(this.state.visibleDomain.from)}
						// />
						// <Dev
						// 	domain={this.state.domain}
						// 	visibleDomain={this.state.visibleDomain}
						// />