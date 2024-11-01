export class VideoSwitcher {
	constructor(node) {
		this.node           = node;
		this.mode           = 'primary';
		this.noDefault      = this.node.classList.contains('video-accessibility--no-default');
		this.isOneCol       = this.node.classList.contains('video-accessibility--1c');
		this.index          = this.noDefault ? 0 : -1;
		this.srt            = this.node.querySelector('.video-accessibility__srt');
		this.srtPrimary     = this.node.querySelector('.video-accessibility__srt--primary');
		this.srtSecondary   = this.node.querySelector('.video-accessibility__srt--secondary');
		this.primary        = this.node.querySelector('.video-accessibility__media--primary');
		this.secondary      = this.node.querySelector('.video-accessibility__media--secondary');
		this.aside          = this.node.querySelector('.video-accessibility__aside');
		this.asideDefault   = this.node.querySelector('.video-accessibility__aside > .video-accessibility__panel');
		this.panels         = this.node.querySelectorAll('.video-accessibility__panels > .video-accessibility__panel');
		this.controls       = this.node.querySelectorAll('.video-accessibility__control > button');
		this.panelControls  = Array.from( this.controls ).filter( node => 'panel' === node.dataset.control );
		this.switchControls = Array.from( this.controls ).filter( node => 'switch' === node.dataset.control );
		this.activeClass    = 'panel--active';
		this.gap            = getComputedStyle(document.body).getPropertyValue('--wp--style--block-gap') ? getComputedStyle(document.body).getPropertyValue('--wp--style--block-gap') : '2vw';

		setTimeout(() => {
			this.controlHeight = this.node.querySelector('.video-accessibility__controls').offsetHeight;
			this.maxPanelHeight = `calc(${ this.primary.offsetHeight }px + ${ this.controlHeight }px + ${ this.gap })`;
			this.node.style.setProperty('--vs-panel-max-height', this.maxPanelHeight);
		}, 500)

		//add checks for tablet size to change panel behaviour
		this.mediaQuery = '(max-width: 781px)';
		this.mediaQueryList = window.matchMedia(this.mediaQuery);
		
		this.panelControls.forEach( ( panelControl, panelControlIndex ) => {
			panelControl.addEventListener( 'click', (e) => {
				if( (this.noDefault && this.isOneCol) || this.mediaQueryList.matches ){
					
					let btn = e.target.classList.contains('wp-block-button__link') ? e.target : e.target.closest('.wp-block-button__link');
					if( btn.classList.contains('panel--active')) {
						this.panelControls[panelControlIndex].classList.remove(this.activeClass);
						this.panels[panelControlIndex].hidden = true;
					} else {
						this.goTo(panelControlIndex);
					}
				} else if (this.noDefault){
					this.goTo(panelControlIndex === this.index ? 0 : panelControlIndex);
				} else {
					this.goTo(panelControlIndex === this.index ? -1 : panelControlIndex);
				}
				

			})
		} );

		this.node.addEventListener('click',(e)=> {
			if(!e.target.closest('[data-control="switch"]')) return;
			this.switch();

		});

		this.panelLengthCheck();
		this.setMode( this.mode );

		this.windowActions();
		
		this.mediaQueryList.addEventListener('change', event => {
			if(!this.mediaQueryList.matches && this.noDefault && !this.isOneCol) {
				let allHidden = true;
				this.panels.forEach((panel) => {
					if(!panel.attributes.hidden) {
						allHidden = false;
					}
				});
				if(allHidden === true) {
					this.goTo(0);
				}
			}
		});		
	}


	windowActions () {
		//add debounce if performance issues
		window.addEventListener('resize', () => {
			this.controlHeight = this.node.querySelector('.video-accessibility__controls').offsetHeight;
			this.maxPanelHeight = `calc(${ this.primary.offsetHeight }px + ${ this.controlHeight }px + ${this.gap} )`;
			this.node.style.setProperty('--vs-panel-max-height', this.maxPanelHeight);
		});
	}

	panelLengthCheck() {
		if (this.noDefault && this.panels.length === 0) {
			this.node.classList.remove('video-accessibility--2c');
			this.aside.style.display = "none";

		} else if (this.noDefault && this.isOneCol) {
			this.panels.forEach((panel) => {
				panel.hidden = true;
			});
		} else if (this.noDefault ){
			if(this.mediaQueryList.matches) {
				this.panels.forEach((panel) => {
					panel.hidden = true;
				});
			} else  {
				this.goTo(0);
			}
		}
		else {
			this.goTo(this.index);
		}
	}

	hideMediaNode( node ) {
		const { parentNode, nextSibling } = node;

		// detach and re-attach the node in place so videos stop playing
		node.hidden = true;
		parentNode.removeChild( node );
		parentNode.insertBefore( node, nextSibling );

		// try and pause any video tags
		node.querySelectorAll('video').forEach( video => video.pause() );
	}

	setMode( mode ) {
		this.mode = mode;

		if ( this.mode === 'secondary' ) {
			this.secondary.removeAttribute('hidden');
			this.hideMediaNode( this.primary );
			if(this.srtSecondary) {
				this.srtSecondary.hidden = false;
				this.srtPrimary.hidden = true;
			}
			
		} else {
			this.primary.removeAttribute('hidden');
			this.hideMediaNode( this.secondary );
			if(this.srtPrimary) {
				this.srtPrimary.hidden = false;
			}
			if(this.srtSecondary) {
				this.srtSecondary.hidden = true;
			}
		}

		this.switchControls.forEach( () => {
			const texts = this.node.querySelectorAll('[data-control="switch"] .video-accessibility__control-text');

			texts.forEach( text => {
				let hidden = false;

				if ( 'secondary' === this.mode ) {
					hidden = ! text.classList.contains('video-accessibility__control-text--switch');
				} else {
					hidden = text.classList.contains('video-accessibility__control-text--switch');
				}

				if ( hidden ) {
					text.hidden = true;
				} else {
					text.removeAttribute('hidden');
				}
			} );
		} );
	}

	switch() {
		this.setMode( this.mode === 'primary' ? 'secondary' : 'primary' );
	}

	goTo( index ) {
		this.index = index;
		if (this.index > -1 || this.noDefault) {
			this.asideDefault.hidden = true;
		} else {
			this.asideDefault.removeAttribute( 'hidden' );
		}

			this.panels.forEach((panel, panelIndex) => {
				if (panelIndex === this.index) {
					this.panelControls[panelIndex].classList.add(this.activeClass);
					panel.removeAttribute('hidden');
				} else {
					this.panelControls[panelIndex].classList.remove(this.activeClass);
					panel.hidden = true;
				}
			});



	}
}

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll('.video-accessibility').forEach( node => {
		new VideoSwitcher( node );
	} );
} );
